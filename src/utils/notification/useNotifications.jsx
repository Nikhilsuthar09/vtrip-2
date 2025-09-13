import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../Configs/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

export const usePushNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const lastStored = useRef("");
  const { uid } = useAuth();
  const navigation = useNavigation();

  const storePushTokenInFirestore = async (expoPushToken, uid) => {
    if (lastStored.current === expoPushToken) return;
    try {
      const userDocRef = doc(db, "user", uid);
      await updateDoc(userDocRef, {
        pushToken: expoPushToken,
      });
      lastStored.current = expoPushToken;
    } catch (e) {
      console.log(e);
    }
  };
  const registerForPushNotifications = async () => {
    if (isRegistering) return; // Prevent multiple concurrent registrations

    setIsRegistering(true);

    try {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      if (!Device.isDevice) {
        throw new Error("Must use physical device for push notifications");
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        throw new Error("Permission not granted for push notifications");
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found");
      }

      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      setExpoPushToken(pushTokenString);

      // Store token if user is authenticated
      if (uid) {
        await storePushTokenInFirestore(pushTokenString, uid);
      }

      return pushTokenString;
    } catch (error) {
      console.error("Error registering for push notifications:", error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };
  useEffect(() => {
    // Set notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Listen for notifications received while app is foregrounded
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setNotification(notification);
      }
    );

    // Listen for user interactions with notifications
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // You can handle navigation or other actions here based on the notification data
        const screen = response?.notification?.request?.content?.data?.screen;
        navigation.navigate(screen);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (!uid) return;
    if (!expoPushToken && !isRegistering) {
      registerForPushNotifications().catch((error) =>
        console.error("Auto-registration failed:", error)
      );
    }
  }, [uid, expoPushToken]);
  return { expoPushToken, notification };
};
