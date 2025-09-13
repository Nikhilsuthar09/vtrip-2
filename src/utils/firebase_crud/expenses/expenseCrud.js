import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../Configs/firebaseConfig";
import { Alert } from "react-native";

export const deleteExpense = async (tripId, itemId, expensePathName) => {
  try {
    const itemDocRef = doc(db, "trip", tripId, expensePathName, itemId);
    await deleteDoc(itemDocRef);
    Alert.alert("Success!", "Item deleted Successfully");
  } catch (e) {
    console.error("Failed to delete the item", e);
    Alert.alert("Error!", "Something went wrong");
  }
};

export const addExpense = async (tripId, newExpense, expensePathName) => {
  const expenseToStore = {
    expenseType: newExpense.expenseType,
    amount: newExpense.amount,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  if (expensePathName === "onTripExpenses") {
    expenseToStore.paidBy = newExpense.paidBy;
    expenseToStore.uid = newExpense.uid;
  }
  try {
    const expenseCollectionRef = collection(
      db,
      "trip",
      tripId,
      expensePathName
    );
    await addDoc(expenseCollectionRef, expenseToStore);
    console.log("expense stored successful");
  } catch (e) {
    console.log("add expense error ", e);
    Alert.alert("Error!", "Something went wrong");
  }
};

export const updateExpense = async (
  tripId,
  itemId,
  expense,
  expensePathName
) => {
  try {
    const itemToUpdate = {
      expenseType: expense.expenseType,
      amount: expense.amount,
      updatedAt: serverTimestamp(),
    };
    if (expensePathName === "onTripExpenses") {
      itemToUpdate.paidBy = expense.paidBy;
      itemToUpdate.uid = expense.uid;
    }
    const itemDocRef = doc(db, "trip", tripId, expensePathName, itemId);
    await updateDoc(itemDocRef, itemToUpdate);
    Alert.alert("Success!", "Item updated successfully");
  } catch (e) {
    console.log("Error Updating Item", e);
    Alert.alert("Error Updating Item");
  }
};
