import { useState, useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SectionList, View, Text, StyleSheet, Alert } from "react-native";
import ShowTripsCard from "../components/ShowTripsCard";
import HeaderWithSearch from "../components/HeaderWithSearch";
import Spinner from "../components/Spinner";
import TripMenuModal from "../components/TripMenuModal";
import AddTripModal from "../components/AddTripModal";
import EmptyTripsPlaceholder from "../components/EmptyTripsPlaceholder";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getTripStatus } from "../utils/calendar/getTripStatus";
import { deleteTrip } from "../utils/tripData/deleteTripData";
import { useUserTripsData } from "../utils/firebaseUserHandlers";
import ErrorScreen from "../components/ErrorScreen";
import { useNavigation } from "@react-navigation/native";
import { useTravellerNames } from "../utils/firebaseTravellerHandler";
import * as Haptics from "expo-haptics";
import { useAuth } from "../Context/AuthContext";

const MyTrip = () => {
  const [modalData, setModalData] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editTripData, setEditTripData] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { uid } = useAuth();
  const { tripsData, loading, error, refetch } = useUserTripsData(uid);
  const navigation = useNavigation();
  const { travellerNames } = useTravellerNames(modalData?.selectedItemId);
  const safeTripData = tripsData || [];
  const safeTravellerNames = travellerNames || [];

  // Organize and filter trips
  const organizedTrips = useMemo(() => {
    let filteredTrips = safeTripData;

    // Apply search filter
    if (searchText.trim() !== "") {
      filteredTrips = safeTripData.filter(
        (trip) =>
          trip.destination
            .toLowerCase()
            .includes(searchText.toLowerCase().trim()) ||
          trip.title.toLowerCase().includes(searchText.toLowerCase().trim())
      );
    }

    // Categorize trips
    const categorized = {
      ongoing: [],
      upcoming: [],
      completed: [],
    };

    filteredTrips.forEach((trip) => {
      const status = getTripStatus(trip.startDate, trip.endDate);
      categorized[status].push(trip);
    });

    // Sort each category
    categorized.ongoing.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    categorized.upcoming.sort(
      (a, b) => new Date(a.startDate) - new Date(b.startDate)
    );
    categorized.completed.sort(
      (a, b) => new Date(b.endDate) - new Date(a.endDate)
    );

    // Create sections for SectionList - always show all sections in order
    const sections = [
      {
        title: "Ongoing",
        data: categorized.ongoing,
        key: "ongoing",
        icon: "flight-takeoff",
        color: COLOR.success || "#4CAF50",
      },
      {
        title: "Upcoming",
        data: categorized.upcoming,
        key: "upcoming",
        icon: "schedule",
        color: COLOR.primary || "#2196F3",
      },
      {
        title: "Completed",
        data: categorized.completed,
        key: "completed",
        icon: "check-circle",
        color: COLOR.grey || "#757575",
      },
    ];

    return sections;
  }, [safeTripData, searchText]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    console.log(error);
    return <ErrorScreen />;
  }
  const openDrawer = () => {
    Haptics.selectionAsync();
    navigation.openDrawer();
  };
  const totalTrips = organizedTrips.reduce(
    (sum, section) => sum + section.data.length,
    0
  );

  const openMenu = (position) => {
    const selectedItemData = safeTripData.find(
      (item) => item.id === position.itemId
    );

    setModalData({
      visible: true,
      position,
      selectedItemId: position.itemId,
      selectedItemData,
    });
  };

  const closeMenu = () => setModalData(null);

  // to do
  const handleDeleteTrip = async (tripId) => {
    const travellerArray = modalData.selectedItemData.travellers;
    const tripData = safeTripData.find((item) => item.id === tripId);
    if (tripData?.createdBy != uid) {
      Alert.alert(
        "Invalid Action",
        "Only trip organiser can perform this action"
      );
      return;
    }
    const result = await deleteTrip(tripId, travellerArray);

    if (result.success) {
      Alert.alert("Success", result.message);
    } else {
      Alert.alert("Error", result.message);
    }
  };

  const handleDeleteButton = (id) => {
    Alert.alert(
      "Are you sure?",
      `Do you want to delete this trip?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await handleDeleteTrip(id);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditTrip = (id) => {
    const tripToEdit = safeTripData.find((trip) => trip.id === id);
    if (tripToEdit) {
      setEditTripData(tripToEdit);
      setIsEditModalVisible(true);
      closeMenu();
    }
  };
  const handleInvitePress = (id) => {
    const tripDetails = safeTripData.find((trip) => trip.id === id);
    navigation.navigate("invite", {
      id: tripDetails.id,
      title: tripDetails.title,
      destination: tripDetails.destination,
      startDate: tripDetails.startDate,
      endDate: tripDetails.endDate,
      travellers: safeTravellerNames,
      createdBy: tripDetails.createdBy,
    });
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditTripData(null);
  };

  const handleAddTrip = () => {
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    setIsAddModalVisible(false);
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderSectionHeader = ({ section }) => {
    // Only show section header if there are trips in that section
    if (section.data.length === 0) return null;

    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          <View style={styles.sectionHeaderLeft}>
            <MaterialIcons
              name={section.icon}
              size={20}
              color={section.color}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: section.color }]}>
              {section.title}
            </Text>
            <View
              style={[styles.countBadge, { backgroundColor: section.color }]}
            >
              <Text style={styles.countText}>{section.data.length}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <ShowTripsCard
      id={item.id}
      title={item.title}
      destination={item.destination}
      startDate={item.startDate}
      endDate={item.endDate}
      budget={item.budget}
      createdBy={item.createdBy}
      image={item?.imageUrl}
      openModal={openMenu}
    />
  );
  const showPlaceholder = totalTrips === 0;

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithSearch
        openDrawer={openDrawer}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {showPlaceholder ? (
        <EmptyTripsPlaceholder
          searchText={searchText}
          onAddTrip={handleAddTrip}
        />
      ) : (
        <SectionList
          refreshing={refreshing}
          onRefresh={onRefresh}
          sections={organizedTrips}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          stickySectionHeadersEnabled={false}
        />
      )}

      <TripMenuModal
        visible={modalData?.visible || false}
        closeModal={closeMenu}
        position={modalData?.position}
        selectedId={modalData?.selectedItemId}
        onDelete={handleDeleteButton}
        onEdit={handleEditTrip}
        onInvite={handleInvitePress}
      />

      <AddTripModal
        isModalVisible={isEditModalVisible}
        onClose={closeEditModal}
        onBackButtonPressed={closeEditModal}
        editTripData={editTripData}
        isEditMode={true}
        refetch={refetch}
      />

      <AddTripModal
        isModalVisible={isAddModalVisible}
        onClose={closeAddModal}
        onBackButtonPressed={closeAddModal}
        isEditMode={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.stroke || "#e0e0e0",
  },
  sectionHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.h3 || 16,
    fontFamily: FONTS.semiBold,
    marginRight: 12,
  },
  countBadge: {
    minWidth: 24,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  countText: {
    color: "#fff",
    fontSize: FONT_SIZE.caption || 12,
    fontFamily: FONTS.medium,
  },
});

export default MyTrip;
