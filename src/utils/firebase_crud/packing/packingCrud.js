import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { db } from "../../../Configs/firebaseConfig";

export const handleUpdateItem = async (tripId, editDocId, packingListData) => {
  try {
    const itemToUpdate = {
      category: packingListData.category,
      item: packingListData.item,
      quantity: parseInt(packingListData.quantity),
      note: packingListData.note,
      updatedAt: serverTimestamp(),
    };
    const itemDocRef = doc(db, "trip", tripId, "packing", editDocId);
    await updateDoc(itemDocRef, itemToUpdate);
    Alert.alert("Success!", "Item updated successfully");
    return true;
  } catch (e) {
    console.log("Error Updating Item", e);
    Alert.alert("Error Updating Item");
    return false;
  }
};

export const handleAddPackingItem = async (tripId, packingListData) => {
  try {
    const packingListToStore = {
      category: packingListData.category,
      item: packingListData.item,
      quantity: parseInt(packingListData.quantity),
      note: packingListData.note,
      isPacked: false,
      createdAt: serverTimestamp(),
    };
    const packingCollectionRef = collection(db, "trip", tripId, "packing");
    await addDoc(packingCollectionRef, packingListToStore);
    Alert.alert("Success!", "Item Added successfully");
    return true;
  } catch (e) {
    console.log("Error Adding Item", e);
    Alert.alert("Error Adding Item");
    return false;
  }
};
