import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { Alert } from "react-native";

  const handleDeleteItem = async (tripId, itemId) => {
    try {
      const itemDocRef = doc(db, "trip", tripId, "packing", itemId);
      await deleteDoc(itemDocRef);
      Alert.alert("Success!","Item deleted Successfully")
    } catch (e) {
      console.error("Failed to delete the item", e);
      Alert.alert("Error!","Something went wrong")
    }
  };
  export {handleDeleteItem}