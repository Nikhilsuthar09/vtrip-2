import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../Configs/firebaseConfig";
import { Alert } from "react-native";

export const useTripDeletionListener = (tripId) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!tripId) return;

    const tripDocRef = doc(db, "trip", tripId);

    const unsubscribe = onSnapshot(
      tripDocRef,
      (docSnapshot) => {
        // If document doesn't exist, the trip has been deleted
        if (!docSnapshot.exists()) {
          unsubscribe();
          Alert.alert(
            "oops",
            "This trip doesn't exist anymore.",
            [
              {
                text: "OK",
                onPress: () => {
                  // Navigate back to MyTrip screen
                  navigation.navigate("MainDrawer", {
                    screen: "MainApp",
                    params: {
                      screen: "BottomTabs",
                      params: {
                        screen: "My Trips",
                      },
                    },
                  });
                },
              },
            ],
            { cancelable: false }
          );
        }
      },
      (error) => {
        console.error("Error listening to trip changes:", error);
        // Optionally handle the error - maybe the user lost connection
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [tripId, navigation]);
};

export default useTripDeletionListener;
