import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  Animated,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import AddPackingModal from "../components/Packing/AddPackingModal";
import { useTripPackingList } from "../utils/firebaseTripHandler";
import Spinner from "../components/Spinner";
import PackingListCard from "../components/Packing/PackingListCard";
import ProgressBar from "../components/Packing/ProgressBar";
import Placeholder from "../components/Placeholder";
import { handleDeleteItem } from "../utils/packing/firebaseDeleteHandler";
import { handlePackedItems } from "../utils/packing/firebaseMarkAsPackedHandler";
import ItineraryMenuModal from "../components/itinerary/ItineraryMenuModal";

const Packing = ({ route }) => {
  const { id } = route.params;
  const { packingData, loading, error } = useTripPackingList(id);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isChecked, setChecked] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [addbyCategory, setAddbyCategory] = useState(null);
  const [isMarkingPacked, setIsMarkingPacked] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (error) console.log(error);
  if (loading) return <Spinner />;

  const safePackingData = packingData || [];
  const checkedItems = safePackingData.filter((items) => items.isPacked).length;

  const onMenuPress = (item, event) => {
    const { pageX, pageY } = event.nativeEvent;
    setSelectedItem(item);
    setButtonPosition({ x: pageX, y: pageY });
    setMenuModalVisible(true);
  };

  const packingByCategory = safePackingData.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const totalItems = Object.values(packingByCategory).reduce(
    (sum, items) => sum + items.length,
    0
  );

  const toggleChecked = (itemId) => {
    setChecked((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const totalChecked = Object.values(isChecked).filter(Boolean).length;

  const markAsPacked = async () => {
    setIsMarkingPacked(true);

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const success = await handlePackedItems(id, isChecked);
      if (success) {
        setChecked({});
      }
    } finally {
      setIsMarkingPacked(false);
    }
  };

  const deleteItem = async (itemId) => {
    await handleDeleteItem(id, itemId);
  };

  const handleEditItem = async (itemId) => {
    const itemToEdit = safePackingData.find((item) => item.id === itemId);
    if (itemToEdit) {
      setEditItem(itemToEdit);
      toggleModal();
    }
  };

  const handleCloseModal = () => {
    setEditItem(null);
    setAddbyCategory(null);
    setIsModalVisible(!isModalVisible);
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddByCategory = (category) => {
    if (category) {
      setAddbyCategory(category);
      toggleModal();
    }
  };

  return (
    <View style={styles.container}>
      {safePackingData.length === 0 ? (
        <Placeholder onPress={toggleModal} />
      ) : (
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={totalItems > 0 ? checkedItems / totalItems : 0}
                totalitems={totalItems}
              />
              <Text style={styles.progressSubtitle}>
                {checkedItems} of {totalItems} items packed
              </Text>
            </View>

            {/*  Action Button */}
            <Animated.View
              style={[
                styles.actionButtonContainer,
                {
                  transform: [{ scale: buttonScaleAnim }],
                  opacity: totalChecked > 0 ? 1 : 0.5,
                },
              ]}
            >
              <TouchableOpacity
                disabled={totalChecked === 0 || isMarkingPacked}
                onPress={markAsPacked}
                style={styles.actionButton}
                activeOpacity={totalChecked > 0 ? 0.8 : 1}
              >
                <View style={styles.actionButtonContent}>
                  {isMarkingPacked ? (
                    <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  ) : (
                    <Ionicons name="bag-check" size={18} color="#fff" />
                  )}
                  <Text style={styles.actionText}>
                    {isMarkingPacked
                      ? "Marking..."
                      : `Mark${
                          totalChecked === 0 ? "" : " " + totalChecked
                        } as packed`}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/*  Info Container */}
            <View style={styles.infoContainer}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="information-circle" size={20} color="#007AFF" />
              </View>
              <Text style={styles.infoText}>
                Tap items to select, then mark as packed when ready
              </Text>
            </View>

            {/* Categories */}
            {Object.keys(packingByCategory)
              .sort()
              .map((category, index, array) => (
                <PackingListCard
                  key={category}
                  title={category}
                  data={packingByCategory[category]}
                  toggleChecked={toggleChecked}
                  isChecked={isChecked}
                  openModal={onMenuPress}
                  isLast={index === array.length - 1}
                  handleAddByCategory={handleAddByCategory}
                />
              ))}
          </ScrollView>

          {/* FAB */}
          <TouchableOpacity
            onPress={toggleModal}
            activeOpacity={0.8}
            style={styles.fab}
          >
            <Ionicons name="add" size={28} color={COLOR.actionText} />
          </TouchableOpacity>
        </Animated.View>
      )}

      <ItineraryMenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        buttonPosition={buttonPosition}
        onEdit={handleEditItem}
        onDelete={deleteItem}
        selectedItem={selectedItem}
      />

      <AddPackingModal
        packingByCategory={packingByCategory}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        tripId={id}
        editingItem={editItem}
        addbyCategory={addbyCategory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressContainer: {
    marginBottom: 6,
  },
  progressSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: "#6c757d",
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: COLOR.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 25,
    width: "50%",
  },
  actionButtonContainer: {
    alignItems: "flex-end",
    height: 35,
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  actionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    fontFamily: FONTS.semiBold,
    color: "#fff",
    fontSize: FONT_SIZE.caption,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  infoContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    backgroundColor: "#e3f2fd",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  infoIconContainer: {
    marginRight: 12,
    padding: 4,
  },
  infoText: {
    flex: 1,
    color: "#1565c0",
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLOR.actionButton,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Packing;
