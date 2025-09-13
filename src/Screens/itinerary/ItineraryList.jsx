import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import AddItemModal from "../../components/itinerary/AddItemModal";
import { useItinerary } from "../../utils/itinerary/UseItinerary";
import Spinner from "../../components/Spinner";
import ErrorScreen from "../../components/ErrorScreen";
import EmptyItineraryPlaceholder from "../../components/itinerary/EmptyItineraryPlaceholder";
import ItineraryMenuModal from "../../components/itinerary/ItineraryMenuModal";
import ItineraryListItem from "../../components/itinerary/ItineraryListItems";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

const ItineraryList = ({ route }) => {
  // firebase data
  const itemListData = route.params;
  const tripId = itemListData.tripData.id || "";
  const dayName = itemListData.item.id;
  const { itinerary, loading, error } = useItinerary(tripId, dayName);
  //local state variables
  const [modalVisible, setModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  if (loading) return <Spinner />;
  if (error) return <ErrorScreen />;
  const onMenuPress = (item, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedItem(item);
    setButtonPosition({ x: pageX, y: pageY });
    setMenuModalVisible(true);
  };
  const handleEdit = (item) => {
    setEditItem(item);
    setModalVisible(true);
  };

  const deleteItem = async (item) => {
    try {
      const itemIdToDelete = item.id;
      const itemDocRef = doc(db, "trip", tripId, dayName, itemIdToDelete);
      await deleteDoc(itemDocRef);
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Something went wrong try again..");
    }
  };
  const handleDelete = async (item) => {
    Alert.alert(
      "Are you sure?",
      `Do you want to delete ${item.title}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: async () => {
            await deleteItem(item);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centeringContainer}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>{itemListData.item.title}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Feather
                name="calendar"
                size={14}
                style={styles.calendarIcon}
                color={COLOR.placeholder}
              />
              <Text style={styles.dateText}> {itemListData.item.date}</Text>
            </View>
          </View>

          {/* Itinerary List */}
          {itinerary.length === 0 ? (
            <EmptyItineraryPlaceholder />
          ) : (
            <FlatList
              data={itinerary}
              renderItem={({ item, index }) => (
                <ItineraryListItem
                  item={item}
                  index={index}
                  totalItems={itinerary.length}
                  onMenuPress={onMenuPress}
                />
              )}
              keyExtractor={(item) => item.id}
              style={styles.flatList}
              contentContainerStyle={styles.flatListContent}
              showsVerticalScrollIndicator={false}
              maxToRenderPerBatch={10}
              windowSize={10}
            />
          )}
        </View>
      </View>
      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={24} color={COLOR.actionText} />
      </TouchableOpacity>

      <AddItemModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        listData={itemListData}
        editItem={editItem}
        setEditItem={setEditItem}
      />
      <ItineraryMenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        buttonPosition={buttonPosition}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedItem={selectedItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeringContainer: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "white",
    paddingBottom: 20,
    borderRadius: 16,
    shadowColor: COLOR.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    maxWidth: 400,
    width: "100%",
    height: 600,
    flex: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H5,
    color: "#212529",
  },
  moreButton: {
    padding: 4,
  },
  moreDotsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR.grey,
    marginHorizontal: 1,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: FONT_SIZE.body,
    color: "#6c757d",
  },
  flatList: {
    flex: 1,
    height: 0,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  fab: {
    position: "absolute",
    bottom: 45,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.actionButton,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
});

export default ItineraryList;
