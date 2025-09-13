import {
  arrayRemove,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Configs/firebaseConfig";

// function to delete userdata from db
export const deleteUserDataInDb = async (uid) => {
  try {
    const userDocRef = doc(db, "user", uid);
    const docSnap = await getDoc(userDocRef);
    if (!docSnap.exists()) {
      throw new Error("user not found");
    }
    const data = docSnap.data();
    const tripIds = data?.tripIds || [];
    const notificationColRef = collection(db, "user", uid, "notification");
    await deleteSubcollection(notificationColRef, "notification");
    await searchTrip(tripIds, uid);
    await deleteDoc(userDocRef);
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const deleteSubcollection = async (collectionRef, collectionName) => {
  try {
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      console.log(`${collectionName} not found`);
      return;
    }
    const deletePromises = [];

    querySnapshot.forEach((document) => {
      deletePromises.push(deleteDoc(document.ref));
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting documents:", error);
    throw error;
  }
};

// function deleteTrips from tripIds array
const searchTrip = async (tripIds, uid) => {
  if (!tripIds || tripIds?.length === 0) return;
  try {
    const promises = tripIds.map(async (id) => {
      try {
        const tripDocRef = doc(db, "trip", id);
        const tripSnapShot = await getDoc(tripDocRef);
        if (!tripSnapShot.exists()) return;
        const tripData = tripSnapShot.data()
        if (!tripData) return;
        const { travellers = [], dayIds = [] } = tripSnapShot.data();
        if (travellers.length <= 1) {
          await deleteTrip(id, dayIds);
        } else {
          await updateDoc(tripDocRef, {
            travellers: arrayRemove(uid),
          });
        }
      } catch (e) {
        console.log("Error processing trip id: ", id);
      }
    });
    Promise.all(promises);
  } catch (e) {
    console.error("Error in searchTrip:", e);
    throw e;
  }
};

const deleteTrip = async (id, dayIds) => {
  try {
    // delete subcollections
    const packingColRef = collection(db, "trip", id, "packing");
    await deleteSubcollection(packingColRef, "packing");
    const plannedExpensesColRef = collection(db, "trip", id, "plannedExpenses");
    await deleteSubcollection(plannedExpensesColRef, "plannedExpenses");
    const onTripExpensesColRef = collection(db, "trip", id, "onTripExpenses");
    await deleteSubcollection(onTripExpensesColRef, "onTripExpenses");

    const dayPromises = dayIds.map(async (dayId) => {
      const dayColRef = collection(db, "trip", id, dayId);
      await deleteSubcollection(dayColRef);
    });
    await Promise.all(dayPromises);
    await deleteDoc(doc(db, "trip", id));
  } catch (e) {
    console.log(e);
  }
};
