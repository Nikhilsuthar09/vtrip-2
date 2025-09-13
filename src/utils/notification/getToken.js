import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";

export const getPushToken = async (uid) => {
  try {
    const docRef = doc(db, "user", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const token = docSnap.data()?.pushToken;
      return token
    }
  } catch (e) {
    console.log(e);
  }
};
