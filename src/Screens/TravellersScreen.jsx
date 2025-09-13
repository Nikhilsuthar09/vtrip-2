import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { formatDate } from "../utils/calendar/handleCurrentDate";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db } from "../Configs/firebaseConfig";
import { useAuth } from "../Context/AuthContext";
import { useTravellerNames } from "../utils/firebaseTravellerHandler";
import { getuserNameChars } from "../utils/common/processUserData";

const TravellersScreen = ({ route, navigation }) => {
  const { id, title, destination, startDate, endDate, createdBy, budget } =
    route.params;
  const { uid } = useAuth();
  const {
    travellerNames: travellers,
    travellerLoading,
    travellerError,
    refetchTraveller,
  } = useTravellerNames(id);

  const removeTraveller = async (userId) => {
    try {
      const tripDocRef = doc(db, "trip", id);
      await updateDoc(tripDocRef, {
        travellers: arrayRemove(userId),
      });
      const userDocRef = doc(db, "user", userId);
      await updateDoc(userDocRef, {
        tripIds: arrayRemove(id),
      });
      Alert.alert("Success", "Traveller removed");
      refetchTraveller();
    } catch (e) {
      console.log(e);
    }
  };

  const handleRemovePress = (userId, name) => {
    Alert.alert(
      "Confirm Action",
      `Are you sure you want remove ${name} from this trip?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => await removeTraveller(userId),
        },
      ]
    );
  };
  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Info Card */}
        <View style={styles.tripCard}>
          <View style={styles.tripIconContainer}>
            <FontAwesome5 name="map-marked-alt" size={18} color="white" />
          </View>
          <View style={styles.tripInfo}>
            <Text style={styles.tripTitle}>
              {title} to {destination}
            </Text>
            <Text style={styles.tripDate}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
            {budget && (
              <View style={styles.budgetContainer}>
                <MaterialIcons
                  name="currency-rupee"
                  size={14}
                  color={COLOR.grey}
                />
                <Text style={styles.budgetText}>{budget}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Travellers List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Travellers</Text>
            <Text style={styles.sectionSubtitle}>
              {travellers?.length}{" "}
              {travellers?.length === 1 ? "person" : "people"} in this trip
            </Text>
          </View>

          <View style={styles.travellersList}>
            {travellers.map((traveller, index) => (
              <View key={traveller.uid} style={styles.travellerItem}>
                <View style={styles.travellerInfo}>
                  <View style={styles.avatarContainer}>
                    {traveller?.imageUrl ? (
                      <Image
                        source={{ uri: traveller.imageUrl }}
                        style={styles.avatar}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {getuserNameChars(traveller?.name)}
                      </Text>
                    )}
                    {traveller.uid === createdBy && (
                      <View style={styles.organizerBadge}>
                        <MaterialIcons name="star" size={8} color="white" />
                      </View>
                    )}
                  </View>

                  <View style={styles.travellerDetails}>
                    <Text style={styles.travellerName}>{traveller.name}</Text>
                    <View style={styles.roleContainer}>
                      {traveller.uid === createdBy ? (
                        <Text style={styles.organizerRole}>Trip Organizer</Text>
                      ) : (
                        <Text style={styles.memberRole}>Trip Member</Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.travellerActions}>
                  {uid === createdBy && traveller.uid !== uid && (
                    <TouchableOpacity
                      onPress={() =>
                        handleRemovePress(traveller.uid, traveller.name)
                      }
                      style={styles.actionButton}
                    >
                      <MaterialIcons
                        name="remove-circle"
                        size={20}
                        color={COLOR.danger}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Invite More Section */}
        <View style={styles.inviteSection}>
          <View style={styles.inviteCard}>
            <View style={styles.inviteIconContainer}>
              <MaterialIcons
                name="person-add"
                size={24}
                color={COLOR.primary}
              />
            </View>
            <View style={styles.inviteContent}>
              <Text style={styles.inviteTitle}>Invite More Travellers</Text>
              <Text style={styles.inviteSubtitle}>
                Share your trip code or send invitations to friends and family
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("invite", {
                  id,
                  title,
                  travellers,
                  destination,
                  startDate,
                  endDate,
                  createdBy,
                })
              }
              style={styles.inviteActionButton}
            >
              <Text style={styles.inviteActionText}>Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollView: {
    flex: 1,
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.primaryLight,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  tripIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  tripDate: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    marginBottom: 4,
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  budgetText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
  },

  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  travellersList: {
    gap: 12,
  },
  travellerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  travellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.primaryLight,
    textAlign: "center",
    textAlignVertical: "center",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.primary,
  },
  organizerBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLOR.secondary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  travellerDetails: {
    flex: 1,
  },
  travellerName: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerRole: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.secondary,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  memberRole: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  travellerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  inviteSection: {
    marginTop: 24,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  inviteCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.primaryLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderStyle: "dashed",
  },
  inviteIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  inviteContent: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  inviteSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  inviteActionButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  inviteActionText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: "white",
  },
});

export default TravellersScreen;
