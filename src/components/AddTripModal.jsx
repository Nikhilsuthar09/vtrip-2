import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
// local file imports
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { handleDayPress } from "../utils/calendar/handleDayPress";
import { getMarkedDates } from "../utils/calendar/handleMarkedDates";
import {
  formatDate,
  getCurrentDate,
} from "../utils/calendar/handleCurrentDate";
import { addTripToDb } from "../utils/tripData/handleStoreTripData";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../Configs/firebaseConfig";
import ImagePickerComponent from "./ImagePickerComponent";
import { uploadImageToCloudinary } from "../utils/tripData/uploadImage";
import { useAuth } from "../Context/AuthContext";

const AddTripModal = ({
  isModalVisible,
  onClose,
  onBackButtonPressed,
  editTripData = null,
  isEditMode = false,
  refetch,
}) => {
  const [activeInput, setActiveInput] = useState(null);
  const [tripData, setTripData] = useState({
    title: "",
    destination: "",
    budget: "",
    image: null,
    start: "",
    end: "",
  });
  const [loading, setLoading] = useState(false);
  const {uid} = useAuth()

  useEffect(() => {
    if (isEditMode && editTripData) {
      setTripData({
        title: editTripData.title || "",
        destination: editTripData.destination || "",
        budget: editTripData.budget?.toString() || "",
        start: editTripData.startDate || "",
        end: editTripData.endDate || "",
        image: editTripData?.imageUrl || null,
      });
    }
  }, [isEditMode, editTripData]);

  const resetTripData = () => {
    setTripData({
      title: "",
      destination: "",
      budget: "",
      image: null,
      start: "",
      end: "",
    });
  };

  const resetDates = () => {
    setTripData((prev) => ({
      ...prev,
      start: "",
      end: "",
    }));
  };

  const handleTripDataChange = (field, value) => {
    setTripData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const noOfDays =
    Math.ceil(
      (new Date(tripData.end) - new Date(tripData.start)) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  const handleStoreTripData = async () => {
    try {
      setLoading(true);

      let updatedTripData = { ...tripData };
      if (tripData.image) {
        const imageUrl = await uploadImageToCloudinary(tripData.image);
        updatedTripData = {
          ...updatedTripData,
          image: imageUrl,
        };
        setTripData(updatedTripData);
      }

      if (isEditMode) {
        const success = await updateTrip(updatedTripData);
        if (success) {
          resetTripData();
          await refetch();
          onClose();
        } else {
          return;
        }
      } else {
        const success = await addTripToDb(updatedTripData, uid);
        if (success) {
          resetTripData();
          onClose();
        }
      }
    } catch (e) {
      Alert.alert("Error", "Failed to save the trip. Please try again");
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const updateTrip = async (tripData) => {
    if (!tripData.title.trim()) {
      Alert.alert("Please enter a title");
      return false;
    }
    if (!tripData.destination.trim()) {
      Alert.alert("Please enter your destination");
      return false;
    }
    if (!tripData.budget.trim()) {
      Alert.alert("Please enter your budget");
      return false;
    }
    const budgetNumber = parseInt(tripData.budget);
    if (isNaN(budgetNumber)) {
      Alert.alert("Please enter a valid amount");
      return false;
    }
    if (!tripData.start) {
      Alert.alert("Please select a start date");
      return false;
    }
    if (!tripData.end) {
      Alert.alert("Please select an end date");
      return false;
    }
    try {
      const tripId = editTripData.id;
      const tripToUpdate = {
        title: tripData.title.trim(),
        destination: tripData.destination.trim(),
        budget: budgetNumber,
        startDate: tripData.start,
        endDate: tripData.end,
        imageUrl: tripData.image,
        updatedAt: serverTimestamp(),
      };
      const tripDocRef = doc(db, "trip", tripId);
      await updateDoc(tripDocRef, tripToUpdate);
      console.log("Updated Successfully");
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  const handleModalClose = () => {
    if (onBackButtonPressed) {
      onBackButtonPressed();
    }
    onClose();
  };

  return (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleModalClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView nestedScrollEnabled={true}>
          <StatusBar style="dark" />
          <View style={styles.modalContainer}>
            <View style={styles.headingContainer}>
              <Text style={styles.heading}>
                {isEditMode ? "Edit Trip" : "Add a trip"}
              </Text>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <AntDesign name="close" size={24} color={COLOR.primary} />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.inputContainer}>
                <AntDesign
                  name="tags"
                  size={18}
                  color={activeInput === "title" ? COLOR.primary : COLOR.grey}
                  style={styles.icon}
                />
                <TextInput
                  onChangeText={(text) => handleTripDataChange("title", text)}
                  value={tripData.title}
                  onFocus={() => setActiveInput("title")}
                  onBlur={() => setActiveInput(null)}
                  placeholder="Title (e.g. Office Trip) "
                  placeholderTextColor={COLOR.placeholder}
                  style={[
                    styles.input,
                    activeInput === "title"
                      ? styles.activeColor
                      : styles.inactiveColor,
                  ]}
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="map-marker"
                  size={18}
                  color={
                    activeInput === "destination" ? COLOR.primary : COLOR.grey
                  }
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Destination"
                  placeholderTextColor={COLOR.placeholder}
                  onChangeText={(text) =>
                    handleTripDataChange("destination", text)
                  }
                  value={tripData.destination}
                  onFocus={() => setActiveInput("destination")}
                  onBlur={() => setActiveInput(null)}
                  clearTextOnFocus={true}
                  style={[
                    styles.input,
                    activeInput === "destination"
                      ? styles.activeColor
                      : styles.inactiveColor,
                  ]}
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome
                  name="inr"
                  size={18}
                  color={activeInput === "budget" ? COLOR.primary : COLOR.grey}
                  style={styles.icon}
                />
                <TextInput
                  placeholder="Group Budget"
                  placeholderTextColor={COLOR.placeholder}
                  onChangeText={(text) => handleTripDataChange("budget", text)}
                  value={tripData.budget}
                  keyboardType="numeric"
                  onFocus={() => setActiveInput("budget")}
                  onBlur={() => setActiveInput(null)}
                  clearTextOnFocus={true}
                  style={[
                    styles.input,
                    activeInput === "budget"
                      ? styles.activeColor
                      : styles.inactiveColor,
                  ]}
                />
              </View>
              <ImagePickerComponent
                onImageSelected={(uri) => handleTripDataChange("image", uri)}
                selectedImage={tripData.image}
                placeholder="Add Trip Cover Image (optional)"
              />
              {/* Date Selection Info */}
              <View style={styles.dateInfoContainer}>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>Start Date:</Text>
                  <Text style={styles.dateText}>
                    {tripData.start
                      ? formatDate(tripData.start)
                      : "Select start date"}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>End Date:</Text>
                  <Text style={styles.dateText}>
                    {tripData.end
                      ? formatDate(tripData.end)
                      : "Select end date"}
                  </Text>
                </View>
                {(tripData.start || tripData.end) && (
                  <Pressable style={styles.resetButton} onPress={resetDates}>
                    <Text style={styles.resetButtonText}>Reset Dates</Text>
                  </Pressable>
                )}
              </View>

              <View style={{ marginBottom: 14 }}>
                <Text style={styles.calendarInstruction}>
                  {!tripData.start
                    ? "Tap to select start date"
                    : !tripData.end
                    ? "Tap to select end date"
                    : `${noOfDays} ${noOfDays === 1 ? "day" : "days"} selected`}
                </Text>
                <Calendar
                  onDayPress={(day) =>
                    handleDayPress(tripData, setTripData, day)
                  }
                  markedDates={getMarkedDates(tripData)}
                  minDate={getCurrentDate()}
                  markingType="period"
                  pagingEnabled={true}
                  pastScrollRange={0}
                  futureScrollRange={12}
                  current={getCurrentDate()}
                  theme={{
                    fontFamily: FONTS.regular,
                    selectedDayBackgroundColor: COLOR.primaryLight,
                    selectedDayTextColor: "#ffffff",
                    todayTextColor: COLOR.primary,
                    dayTextColor: "#2d4150",
                    textDisabledColor: "#d9e1e8",
                    monthTextColor: "#2d4150",
                    indicatorColor: COLOR.primary,
                  }}
                />
              </View>
              {loading ? (
                <ActivityIndicator size={"large"} color={COLOR.primary} />
              ) : (
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleStoreTripData}
                >
                  <Text style={styles.createButtonText}>
                    {isEditMode ? "Update trip" : "Add Trip"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    gap: 30,
    backgroundColor: "#fff",
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headingContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H4,
    color: COLOR.textPrimary,
  },
  icon: {
    position: "absolute",
    top: 18,
    left: 10,
  },
  separater: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 14,
  },
  separaterLine: {
    width: 100,
    height: 1,
    backgroundColor: COLOR.stroke,
  },
  orText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    fontSize: FONT_SIZE.body,
    borderRadius: 10,
    height: 55,
    paddingLeft: 32,
    marginBottom: 20,
    borderWidth: 2,
  },
  activeColor: {
    borderColor: COLOR.primary,
  },
  inactiveColor: {
    borderColor: COLOR.stroke,
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },
  closeButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#fff",
  },
  dateInfoContainer: {
    backgroundColor: COLOR.stroke + "20",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
  },
  dateText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  resetButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLOR.danger,
    borderRadius: 6,
    marginTop: 5,
  },
  resetButtonText: {
    color: "white",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
  },
  calendarInstruction: {
    textAlign: "center",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.primary,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  createButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H6,
    textAlign: "center",
    color: "#fff",
  },
});

export default AddTripModal;