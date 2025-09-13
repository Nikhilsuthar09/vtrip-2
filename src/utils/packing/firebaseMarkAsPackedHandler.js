import { Alert } from "react-native";
import { db } from "../../Configs/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

const handlePackedItems = async (tripId, isChecked) => {
  const checkedKeys = Object.keys(isChecked).filter((key) => isChecked[key]);
  if (checkedKeys.length === 0) {
    Alert.alert("Please select an item to mark");
    return false;
  }
  try {
    const batchUpdates = checkedKeys.map(async (itemId) => {
      const itemDocRef = doc(db, "trip", tripId, "packing", itemId);
      await updateDoc(itemDocRef, { isPacked: true });
    });
    await Promise.all(batchUpdates);
    Alert.alert("Success", "Items marked as packed! ");
    return true;
  } catch (e) {
    console.log(e);
    Alert.alert("Error", "Something went wrong. Please try again");
    return false;
  }
};
export { handlePackedItems };
