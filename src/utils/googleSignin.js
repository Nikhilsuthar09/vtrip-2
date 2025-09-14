// import {
//   GoogleSignin,
//   isErrorWithCode,
//   isSuccessResponse,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { auth } from "../Configs/firebaseConfig";
// import { Alert, ToastAndroid } from "react-native";
// import { addUserToDb } from "./firebaseUserHandlers";

// GoogleSignin.configure({
//   webClientId: process.env.EXPO_PUBLIC_WEBCLIENTID,
//   offlineAccess: false,
//   forceCodeForRefreshToken: false,
// });

// const showErrorAlert = (error) => {
//   if (isErrorWithCode(error)) {
//     switch (error.code) {
//       case statusCodes.IN_PROGRESS:
//         Alert.alert("Sign In", "Sign in already in progress, please wait");
//         break;
//       case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//         Alert.alert(
//           "Google Play Services",
//           "Google Play Services not available. Please update Google Play Services and try again."
//         );
//         break;
//       case statusCodes.SIGN_IN_REQUIRED:
//         Alert.alert("Error", "Please sign in to continue");
//         break;
//       default:
//         console.log(error);
//         Alert.alert("Error", "Something went wrong please try again later");
//     }
//   } else {
//     console.log(error);
//     Alert.alert("Error", "Something went wrong please try again later");
//   }
// };

// const handleNewUser = async (user) => {
//   try {
//     await addUserToDb(user);
//     ToastAndroid.show(`Welcome ${user.name}!`, ToastAndroid.SHORT);
//   } catch (error) {
//     console.error("Error adding new user to database:", error);
//     Alert.alert(
//       "Account Created",
//       "Your account was created but there was an issue saving some data. Please try refreshing."
//     );
//   }
// };

// const handleExistingUser = (userName) => {
//   ToastAndroid.show(`Welcome Back ${userName}`, ToastAndroid.SHORT);
// };

// export const signInGoogle = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const response = await GoogleSignin.signIn();

//     if (!isSuccessResponse(response)) {
//       console.log("google sign in failed");
//       Alert.alert("Sign in failed", "Please try again");
//       return;
//     }

//     const idToken = response.data.idToken;
//     const googleCredential = GoogleAuthProvider.credential(idToken);
//     const userCredential = await signInWithCredential(auth, googleCredential);

//     if (userCredential.additionalUserInfo?.isNewUser) {
//       await handleNewUser(userCredential.user);
//     } else {
//       handleExistingUser(response.data?.user?.name);
//     }
//   } catch (error) {
//     showErrorAlert(error);
//   }
// };

// export const getGoogleCredentialForReauth = async () => {
//   try {
//     await GoogleSignin.hasPlayServices();
//     const response = await GoogleSignin.signIn();

//     if (!isSuccessResponse(response)) {
//       throw new Error("Sign in failed", "Please try again");
//     }

//     const idToken = response.data.idToken;
//     return GoogleAuthProvider.credential(idToken);
//   } catch (error) {
//     throw error;
//   }
// };
