import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import HorizontalList from "../components/home/horizontalList";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import QuickActions from "../components/home/QuickActions";
import { getTripStatus } from "../utils/calendar/getTripStatus";
import { useAuth } from "../Context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useTravellerNames } from "../utils/firebaseTravellerHandler";
import { StatusBar } from "expo-status-bar";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import NotificationIcon from "../components/home/NotificationIconWithBadge";
import PlanAdventureModal from "../components/home/RoomIdModal";
import { EmptyTripCard } from "../components/home/EmptyTripCard";
import { getTripTimingText } from "../utils/home/getTripTimingText";
import { useFetchNotification } from "../utils/notification/useFetchNotifications";
import * as Haptics from "expo-haptics";
import {
  getfirstName,
  getTitleCase,
  getuserNameChars,
} from "../utils/common/processUserData";

const TravelApp = ({ onPress }) => {
  const [isRoomModalVisible, setIsRoomModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadDoc, refetch: refetchNotification } = useFetchNotification();
  const { uid, name, imageUrl } = useAuth();
  const { tripsData, refetch } = useUserTripsData(uid);
  const navigation = useNavigation();
  const safeTripData = tripsData || [];
  useFocusEffect(
    useCallback(() => {
      refetchNotification();
    }, [refetch])
  );
  // Get the primary trip to display (ongoing takes priority over upcoming)
  const primaryTrip = useMemo(() => {
    if (safeTripData.length === 0) return null;

    // First, check for ongoing trips
    const ongoingTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "ongoing";
    });

    if (ongoingTrips.length > 0) {
      // If multiple ongoing trips, get the one that started most recently
      const sortedOngoing = ongoingTrips.sort(
        (a, b) => new Date(b.startDate) - new Date(a.startDate)
      );
      return { ...sortedOngoing[0], status: "ongoing" };
    }

    // If no ongoing trips, look for upcoming trips
    const upcomingTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "upcoming";
    });

    if (upcomingTrips.length > 0) {
      // Get the most upcoming trip (closest start date)
      const sortedUpcoming = upcomingTrips.sort(
        (a, b) => new Date(a.startDate) - new Date(b.startDate)
      );
      return { ...sortedUpcoming[0], status: "upcoming" };
    }

    return null;
  }, [safeTripData]);


  const { travellerNames, travellerLoading, travellerError } =
    useTravellerNames(primaryTrip?.id);
  const safeTravellerNames = travellerNames || [];

  // get quick actions data
  const handleActionNavigation = (screen) => {
    if (primaryTrip) {
      const tripDetails = safeTripData.find(
        (item) => item.id === primaryTrip.id
      );
      navigation.navigate("TopTabs", {
        id: tripDetails.id,
        budget: tripDetails.budget,
        destination: tripDetails.destination,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        screen: screen,
      });
    }
  };

  // navigate to invite screen
  const handleInvitePress = () => {
    if (primaryTrip) {
      const tripDetails = safeTripData.find(
        (item) => item.id === primaryTrip.id
      );
      navigation.navigate("invite", {
        id: tripDetails.id,
        title: tripDetails.title,
        destination: tripDetails.destination,
        startDate: tripDetails.startDate,
        endDate: tripDetails.endDate,
        travellers: safeTravellerNames,
        createdBy: tripDetails.createdBy,
      });
    }
  };

  const recentTrips = useMemo(() => {
    if (safeTripData.length === 0) return [];
    // Filter for completed trips
    const completedTrips = safeTripData.filter((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      return status === "completed";
    });
    // Sort by end date (most recent first) and take first 3
    return completedTrips
      .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
      .slice(0, 3)
      .map((trip, index) => ({
        id: trip.id || index,
        date: new Date(trip.endDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        destination: trip.destination,
        imageUrl: trip?.imageUrl,
      }));
  }, [safeTripData]);

  const openDrawer = () => {
    Haptics.selectionAsync();
    navigation.openDrawer();
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    await refetchNotification();
    setRefreshing(false);
  };

  // navigate to recent trip
  const handleRecentNavigation = (id) => {
    const tripDetails = safeTripData.find((item) => item.id === id);
    navigation.navigate("TopTabs", {
      id: tripDetails.id,
      budget: tripDetails.budget,
      destination: tripDetails.destination,
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
    });
  };

  const onRoomModalPress = () => {
    setIsRoomModalVisible(true);
  };
  const closeRoomModal = () => {
    setIsRoomModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      {/*  Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>
            Hi, {getTitleCase(getfirstName(name))} 👋
          </Text>
          <Text style={styles.subtitle}>Ready for your next adventure?</Text>
        </View>
        <View style={styles.headerRight}>
          <NotificationIcon
            onPress={() => {
              Haptics.selectionAsync();
              navigation.navigate("notification");
            }}
            badgeCount={unreadDoc.length}
          />

          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 50,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center",
              borderStyle: "dashed",
              borderColor: COLOR.primary,
            }}
          >
            <TouchableOpacity
              onPress={openDrawer}
              activeOpacity={0.8}
              style={styles.profileContainer}
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
              ) : (
                <Text style={styles.profileText}>{getuserNameChars(name)}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/*  Trip Card */}
        {primaryTrip ? (
          <>
            <Pressable
              onPress={() => handleActionNavigation("Itinerary")}
              style={styles.tripCard}
            >
              <Image
                source={
                  primaryTrip?.imageUrl || require("../../assets/default.jpg")
                }
                style={styles.tripImage}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
                style={styles.tripOverlay}
              >
                {/*  Status Badge */}
                <View style={styles.statusBadge}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor:
                          primaryTrip.status === "ongoing"
                            ? "#4ade80"
                            : "#f59e0b",
                      },
                    ]}
                  />
                  <Text style={styles.tripStatus}>
                    {primaryTrip.status === "ongoing" ? "Ongoing" : "Upcoming"}
                  </Text>
                </View>

                {/* Destination  */}
                <Text style={styles.tripLocation}>
                  {primaryTrip?.destination || "Plan your next trip"}
                </Text>

                {/*  trip details */}
                <View style={styles.tripDetailsContainer}>
                  <View style={styles.tripDetailItem}>
                    <Ionicons name="time-outline" size={16} color="#fff" />
                    <Text style={styles.tripDuration}>
                      {getTripTimingText(primaryTrip)}
                    </Text>
                  </View>
                  {primaryTrip?.travellers && (
                    <View style={styles.tripDetailItem}>
                      <Ionicons name="people-outline" size={16} color="#fff" />
                      <Text style={styles.tripTravelers}>
                        {primaryTrip.travellers.length || 1}{" "}
                        {primaryTrip?.travellers?.length === 1
                          ? "traveller"
                          : "travellers"}
                      </Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </Pressable>

            {/* Enhanced Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <QuickActions
                onInvitePress={handleInvitePress}
                onActionPress={handleActionNavigation}
              />
            </View>
          </>
        ) : (
          <EmptyTripCard
            onCreatePress={onPress}
            onJoinPress={onRoomModalPress}
          />
        )}

        {/*  Recent Trips */}
        {recentTrips.length > 0 && (
          <View style={styles.recentTripsSection}>
            <View style={styles.recentTripsHeader}>
              <Text style={styles.sectionTitle}>Recent Trips</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("My Trips")}
                style={styles.seeAllButton}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <Entypo
                  name="chevron-small-right"
                  size={20}
                  color={COLOR.primary}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={recentTrips}
              renderItem={({ item }) => (
                <HorizontalList item={item} onPress={handleRecentNavigation} />
              )}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recentTripsContent}
              style={styles.flatListStyle}
            />
          </View>
        )}

        {/* Travel Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Travel Journey</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Foundation name="mountains" size={20} color={COLOR.primary} />
              </View>
              <Text style={styles.statNumber}>{safeTripData.length}</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>

            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Ionicons name="location" size={20} color={COLOR.primary} />
              </View>
              <Text style={styles.statNumber}>
                {new Set(safeTripData.map((trip) => trip.destination)).size}
              </Text>
              <Text style={styles.statLabel}>Destinations</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/*  Floating Action Button */}
      <TouchableOpacity
        onPress={onRoomModalPress}
        style={styles.roomIconButton}
      >
        <LinearGradient
          colors={[COLOR.primary, "#667eea"]}
          style={styles.fabGradient}
        >
          <MaterialIcons name="groups" color="#fff" size={24} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Modal to enter room id */}
      <PlanAdventureModal
        visible={isRoomModalVisible}
        onClose={closeRoomModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8faff",
  },
  headerGradient: {
    paddingBottom: 10,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: "#f8faff",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  greeting: {
    fontSize: FONT_SIZE.H3,
    fontFamily: FONTS.bold,
    color: COLOR.primary,
    marginBottom: 2,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: FONT_SIZE.bodyLarge,
    color: COLOR.grey,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },
  profileContainer: {
    width: 42,
    height: 42,
    borderRadius: 50,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  profileText: {
    color: "#fff",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
  },

  sectionTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  tripCard: {
    height: 200,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 24,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  tripImage: {
    width: "100%",
    height: "100%",
  },
  tripOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    backdropFilter: "blur(10px)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  tripStatus: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: "#fff",
  },
  tripLocation: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.bold,
    color: "white",
  },
  tripDetailsContainer: {
    gap: 2,
  },
  tripDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tripDuration: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: "#fff",
    opacity: 0.95,
  },
  tripTravelers: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: "#fff",
    opacity: 0.95,
  },
  quickActionsContainer: {
    marginBottom: 24,
  },
  recentTripsSection: {
    marginBottom: 24,
  },
  recentTripsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
  },
  seeAllText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.primary,
  },
  recentTripsContent: {
    gap: 16,
    paddingRight: 20,
  },
  flatListStyle: {
    flexGrow: 0,
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  statsTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontSize: FONT_SIZE.H4,
    fontFamily: FONTS.bold,
    color: COLOR.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: "#64748b",
    textAlign: "center",
  },
  roomIconButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: COLOR.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TravelApp;
