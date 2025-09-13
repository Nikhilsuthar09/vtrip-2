import {
  arrayRemove,
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";

// helper to delete subcollections
const deleteSubcollectionInBatches = async (collectionRef, batchSize = 500) => {
  const batches = [];
  let batch = writeBatch(db);
  let operationCount = 0;
  const docs = await getDocs(collectionRef);
  for (const docSnap of docs.docs) {
    batch.delete(docSnap.ref);
    operationCount++;

    if (operationCount >= batchSize) {
      batches.push(batch.commit());
      batch = writeBatch(db);
      operationCount = 0;
    }
  }
  if (operationCount > 0) {
    batches.push(batch.commit());
  }
  await Promise.all(batches);
};

// delete subcollections
const deleteSubCollections = async (tripId, dayIds) => {
  const subCollectionsDeletions = [];
  // delete days subcollection
  for (const dayId of dayIds) {
    const dayColRef = collection(db, "trip", tripId, dayId);
    subCollectionsDeletions.push(deleteSubcollectionInBatches(dayColRef));
  }

  // delete packing subcollection
  const packingColRef = collection(db, "trip", tripId, "packing");
  subCollectionsDeletions.push(deleteSubcollectionInBatches(packingColRef));

  // delete plannedExpenses subcollection
  const plannedExpensesColRef = collection(db, "trip", tripId, "plannedExpenses");
  subCollectionsDeletions.push(deleteSubcollectionInBatches(plannedExpensesColRef));

  // delete onTripExpenses subcollection
  const onTripExpensesColRef = collection(db, "trip", tripId, "onTripExpenses");
  subCollectionsDeletions.push(deleteSubcollectionInBatches(onTripExpensesColRef));

  await Promise.all(subCollectionsDeletions);
};
// transaction approach
const deleteWithTransaction = async (tripDocRef, travellerArray, tripId) => {
  await runTransaction(db, async (transaction) => {
    // check if trip exists
    const tripSnap = await transaction.get(tripDocRef);
    if (!tripSnap.exists()) {
      throw new Error("Trip no longer exists");
    }
    // update all users to remove trip id
    for (const userId of travellerArray) {
      const userDocRef = doc(db, "user", userId);
      transaction.update(userDocRef, {
        tripIds: arrayRemove(tripId),
      });
    }
    // delete the trip document
    transaction.delete(tripDocRef);
  });
};

// batch approach (fallback)
const deleteWithBatch = async (tripDocRef, travellerArray, tripId) => {
  const batch = writeBatch(db);

  // upadte users
  for (const userId of travellerArray) {
    const userDocRef = doc(db, "user", userId);
    batch.update(userDocRef, {
      tripIds: arrayRemove(tripId),
    });
  }
  // delete trip document
  batch.delete(tripDocRef);
  await batch.commit();
};

// batch and transaction based trip deletion
export const deleteTrip = async (tripId, travellerArray) => {
  try {
    const tripDocRef = doc(db, "trip", tripId);
    const docSnap = await getDoc(tripDocRef);
    if (!docSnap.exists()) {
      throw new Error("Trip not found");
    }
    const tripData = docSnap.data();
    const { dayIds = [] } = tripData;

    // step1: delete all subcollections first
    await deleteSubCollections(tripId, dayIds);

    // step2: try transaction approach first
    try {
      await deleteWithTransaction(tripDocRef, travellerArray, tripId);
      return { success: true, message: "Trip deleted successfully" };
    } catch (e) {
      console.log("Transaction failed falling back to batch: ", e);
      await deleteWithBatch(tripDocRef, travellerArray, tripId);
      return { success: true, message: "Trip deleted successfully" };
    }
  } catch (e) {
    console.log("Error deleting trips. ");
    return { success: false, message: "Something went wrong!" };
  }
};
