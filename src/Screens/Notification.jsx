import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useFetchNotification,
  useMarkAsRead,
} from "../utils/notification/useFetchNotifications";
import { formatDateTime } from "../utils/timestamp/formatAndGetTime";
import { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Spinner from "../components/Spinner";
import NotificationPlaceholder from "../components/notification/Placeholder";
import { reqAcceptedBody, status } from "../constants/notification";
import {
  addTravellerToRoom,
  changeStatusInDb,
  deletePendingRequest,
} from "../utils/tripData/room/addTravellerToRoom";
import { useAuth } from "../Context/AuthContext";
import { sendPushNotification } from "../utils/notification/sendNotification";
import { getPushToken } from "../utils/notification/getToken";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState("");
  const [isAcceptLoading, setIsAcceptLoading] = useState("");
  const { notifications, unreadDoc, loading, refetch } = useFetchNotification();
  const { uid, name } = useAuth();
  useMarkAsRead(unreadDoc);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  // function to reject joining request
  const onRejectPress = async (notiId, requesterUid, tripId) => {
    setIsRejectLoading(notiId);
    const message = await changeStatusInDb(uid, notiId, status.REJECTED);
    if (message?.status === "Error") {
      Alert.alert(message.status, message.message);
      setIsRejectLoading("");
      return;
    }
    await deletePendingRequest(requesterUid, tripId);
    setIsRejectLoading("");
    await onRefresh();
  };
  // function to accept joining request
  const onAcceptPress = async (notiId, requesterUid, tripId) => {
    try {
      setIsAcceptLoading(notiId);
      // change status from pending to accepted in firestore
      const message = await changeStatusInDb(uid, notiId, status.ACCEPTED);
      if (message?.status === "Error") {
        Alert.alert(message.status, message.message);
        setIsAcceptLoading("");
        return;
      }
      // finally add traveller to the room
      const response = await addTravellerToRoom(tripId, requesterUid);
      if (response?.status === "Success") {
        // send notification to the requester after successfully adding to room
        const requesterToken = await getPushToken(requesterUid);
        const notifiData = reqAcceptedBody(name);
        await sendPushNotification(requesterToken, notifiData, "notification");
        await deletePendingRequest(requesterUid, tripId);
      } else {
        Alert.alert(response.status, response.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsAcceptLoading("");
    }
    await onRefresh();
  };

  const renderNotificationCard = ({ item: notification }) => (
    <View
      key={notification?.id}
      style={[
        styles.notificationCard,
        { backgroundColor: "#EDE9FE" },
        unreadDoc.id === notification.id && { borderWidth: 1 },
      ]}
    >
      <View style={styles.notificationHeader}>
        <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
          <Ionicons name="airplane" size={20} color="white" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.notificationTitle}>{notification?.title}</Text>
          <Text style={styles.notificationTime}>
            {formatDateTime(notification?.createdAt)}
          </Text>
        </View>
      </View>

      <Text style={styles.notificationDescription}>{notification?.body}</Text>
      {notification?.type === "join_request" &&
        (notification?.status === status.PENDING ? (
          <View style={styles.actionsContainer}>
            {isAcceptLoading === notification?.id ||
            isRejectLoading === notification?.id ? (
              <ActivityIndicator size={"small"} color={COLOR.grey} />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, { borderColor: COLOR.danger }]}
                  onPress={() =>
                    onRejectPress(
                      notification?.id,
                      notification?.requesterUid,
                      notification?.tripId
                    )
                  }
                >
                  <Text style={[styles.actionText, { color: COLOR.danger }]}>
                    Reject
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    onAcceptPress(
                      notification?.id,
                      notification?.requesterUid,
                      notification?.tripId
                    )
                  }
                  style={[
                    styles.actionButton,
                    {
                      borderColor: COLOR.success,
                      backgroundColor: COLOR.success,
                    },
                  ]}
                >
                  <Text style={[styles.actionText, { color: "#fff" }]}>
                    Accept
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ) : (
          <Text
            style={{ fontFamily: FONTS.regular, fontSize: FONT_SIZE.caption }}
          >
            Request {notification.status}
          </Text>
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* notificationsData List */}
      {loading ? (
        <Spinner />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationCard}
          ListEmptyComponent={<NotificationPlaceholder />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  notificationCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  notificationTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    fontFamily: FONTS.semiBold,
  },
  notificationDescription: {
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
  },
});

export default NotificationsScreen;
