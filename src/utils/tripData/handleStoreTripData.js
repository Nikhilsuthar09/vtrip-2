import { getAuth } from "firebase/auth";
import { Alert } from "react-native";
import { generateRandomId } from "./generateTripId";
import { AddTripToUser } from "../firebaseUserHandlers";
import { arrayUnion, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";

const addTripToDb = async (tripData, uid) => {
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
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const tripToStore = {
      title: tripData.title.trim(),
      destination: tripData.destination.trim(),
      budget: budgetNumber,
      startDate: tripData.start,
      endDate: tripData.end,
      imageUrl: tripData.image,
      createdAt: serverTimestamp(),
      createdBy: userId,
      travellers: arrayUnion(userId),
      dayIds: arrayUnion(),
    };

    const tripId = generateRandomId();
    const tripDocRef = doc(db, "trip", tripId);
    await setDoc(tripDocRef, tripToStore);
    await AddTripToUser(tripId, uid);
    Alert.alert("Success", "Trip created successfully!");
    return true;
  } catch (e) {
    console.log("Error storing trip", e);
    Alert.alert("Error", "Failed to create trip. Please try again.");
    return false;
  }
};
export { addTripToDb };
