import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { doc, getDoc } from "firebase/firestore";
import { addUserToDb } from "../firebaseUserHandlers";
import { db } from "../../Configs/firebaseConfig";

const createDefaultUserData = (user) => {
  return {
    name:  user.displayName || "User",
    uid: user.uid,
    email: user.email,
    user,
    imageUrl: user.photoURL || null,
  };
};

const processFirestoreUserData = (docSnap, user) => {
  const data = docSnap.data();
  const uid = docSnap.id;
  const email = data.email;
  const name = data.name;
  const imageUrl = data?.imgUrl;
  
  return { 
    name, 
    uid, 
    email, 
    user, 
    imageUrl 
  };
};

export const getUserData = async (user) => {
  try {
    const userDocRef = doc(db, "user", user.uid);
    const docSnap = await getDoc(userDocRef);
    
    if (!docSnap.exists()) {
      // Handle new Google sign-in users
      if (GoogleSignin.hasPreviousSignIn()) {
        try {
          await addUserToDb(user);
          console.log("Created user document for Google sign-in user");
        } catch (error) {
          console.error("Failed to create user document:", error);
        }
      }
      
      return createDefaultUserData(user);
    }
    
    return processFirestoreUserData(docSnap, user);
  } catch (error) {
    console.error("Error processing user data:", error);
    // Return default user data as fallback
    return createDefaultUserData(user);
  }
};