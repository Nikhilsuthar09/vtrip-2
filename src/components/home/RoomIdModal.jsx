import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { useAuth } from "../../Context/AuthContext";
import {
  addNotificationToDb,
  searchRoomIdInDb,
} from "../../utils/tripData/room/addTravellerToRoom";
import { sendPushNotification } from "../../utils/notification/sendNotification";
import {
  notificationType,
  status,
  tripJoinReqBody,
} from "../../constants/notification";
import { useRequesterPendingId } from "../../utils/tripData/room/fetchRequesterPendingIds";
import { formatLastEdited } from "../../utils/timestamp/formatAndGetTime";
import { SafeAreaView } from "react-native-safe-area-context";

const PlanAdventureModal = ({ visible, onClose }) => {
  const [isLoading, setIsloading] = useState(false);
  const [roomId, setRoomId] = useState("");
  const { uid, name } = useAuth();
  const { ids, loading, refetch } = useRequesterPendingId();

  // function to handle joining room
  const handleJoinTrip = async () => {
    if (
      !roomId.trim() ||
      roomId.length !== 5 ||
      !/^[a-zA-Z0-9]+$/.test(roomId)
    ) {
      Alert.alert("Wrong code", "Please enter a valid code");
      return;
    }
    try {
      setIsloading(true);
      const ownerData = await searchRoomIdInDb(roomId.trim(), uid);
      if (ownerData?.status === "Error") {
        Alert.alert(ownerData.status, ownerData.message);
        setIsloading(false);
        return;
      }

      const message = tripJoinReqBody(
        name,
        ownerData?.title,
        ownerData?.destination
      );
      const result = await addNotificationToDb(
        ownerData?.uid,
        uid,
        roomId.trim(),
        notificationType.JOIN_REQUEST,
        status.PENDING,
        message
      );
      if (result?.status === "Error") {
        Alert.alert(result.status, result.message);
        setIsloading(false);
        return;
      }
      ToastAndroid.show("Request sent", ToastAndroid.SHORT);
      await sendPushNotification(ownerData?.token, message, "notification");
    } catch (e) {
      Alert.alert("Error", "Something went wrong, Please try later");
      console.log(e);
    } finally {
      setIsloading(false);
      onClose();
      setRoomId("");
      refetch();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={50}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={COLOR.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  {/* Icon */}
                  <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                      <Ionicons
                        name="airplane"
                        size={24}
                        color={COLOR.actionText}
                      />
                    </View>
                  </View>

                  {/* Title and Subtitle */}
                  <Text style={styles.title}>Join Your Friends</Text>
                  <Text style={styles.subtitle}>
                    Got a trip code? Enter it below to join the adventure
                  </Text>

                  {/* Join Trip Content */}
                  <View style={styles.joinContainer}>
                    <View style={styles.joinHeader}>
                      <Ionicons name="people" size={20} color={COLOR.primary} />
                      <Text style={styles.joinTitle}>Join Existing Trip</Text>
                    </View>

                    <Text style={styles.roomIdLabel}>Room ID</Text>

                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter room ID (e.g. ABC123)"
                      placeholderTextColor={COLOR.placeholder}
                      value={roomId}
                      onChangeText={setRoomId}
                    />
                    {isLoading ? (
                      <ActivityIndicator size={"large"} color={COLOR.primary} />
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.joinButton,
                          !roomId.trim() && styles.disabledButton,
                        ]}
                        onPress={handleJoinTrip}
                        disabled={!roomId.trim()}
                      >
                        <Ionicons name="log-in" size={20} color="white" />
                        <Text style={styles.joinButtonText}>Join Trip</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>

          {/* Enhanced Requests Sent Section */}
          <View style={styles.requestsSection}>
            <View style={styles.requestsHeader}>
              <View style={styles.requestsHeaderLeft}>
                <Ionicons name="time-outline" size={20} color={COLOR.primary} />
                <Text style={styles.requestsHeaderTitle}>Pending Requests</Text>
              </View>
              {ids.length > 0 && (
                <View style={styles.requestsCountBadge}>
                  <Text style={styles.requestsCountText}>{ids.length}</Text>
                </View>
              )}
            </View>

            {ids.length === 0 ? (
              <View style={styles.emptyRequestsContainer}>
                <Ionicons
                  name="hourglass-outline"
                  size={32}
                  color={COLOR.grey}
                />
                <Text style={styles.emptyRequestsText}>
                  No pending requests
                </Text>
                <Text style={styles.emptyRequestsSubtext}>
                  Your join requests will appear here
                </Text>
              </View>
            ) : loading ? (
              <ActivityIndicator size={"small"} color={COLOR.actionButton} />
            ) : (
              <View style={styles.requestsList}>
                {ids.map((item, index) => (
                  <View key={item?.id || index} style={styles.requestItem}>
                    <View style={styles.requestItemLeft}>
                      <View style={styles.requestIconContainer}>
                        <Ionicons
                          name="paper-plane-outline"
                          size={16}
                          color={COLOR.primary}
                        />
                      </View>
                      <View style={styles.requestItemContent}>
                        <Text style={styles.requestItemId}>
                          Room: {item?.id}
                        </Text>
                        <Text style={styles.requestItemTime}>
                          Sent {formatLastEdited(item.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.requestStatusBadge}>
                      <Text style={styles.requestStatusText}>Pending</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLOR.actionButton,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FONT_SIZE.H4,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    marginBottom: 40,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  joinContainer: {
    width: "100%",
    backgroundColor: "#F8F9FE",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  joinHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  joinTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginLeft: 8,
  },
  roomIdLabel: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: COLOR.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: COLOR.stroke,
  },
  joinButtonText: {
    color: "white",
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
  },
  // Enhanced Requests Section Styles
  requestsSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  requestsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.stroke,
  },
  requestsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  requestsHeaderTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginLeft: 8,
  },
  requestsCountBadge: {
    backgroundColor: COLOR.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  requestsCountText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.semiBold,
    color: COLOR.primary,
  },
  emptyRequestsContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyRequestsText: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    marginTop: 12,
    textAlign: "center",
  },
  emptyRequestsSubtext: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.placeholder,
    marginTop: 4,
    textAlign: "center",
  },
  requestsList: {
    gap: 12,
  },
  requestItem: {
    backgroundColor: "#F8F9FE",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR.primaryLight,
  },
  requestItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  requestIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  requestItemContent: {
    flex: 1,
  },
  requestItemId: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  requestItemTime: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  requestStatusBadge: {
    backgroundColor: COLOR.secondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  requestStatusText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: "white",
  },
});

export default PlanAdventureModal;
