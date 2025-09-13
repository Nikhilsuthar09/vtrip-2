import {  updatePassword } from "firebase/auth";
import { Alert } from "react-native";

const PASSWORD_MESSAGE =
  "Password must contain atleast \n- 1 lowercase letter\n- 1 upper case letter\n- 6 characters";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handleFirebaseAuthErrors = (error) => {
  if (error.code === "auth/invalid-email") {
    return "Please enter valid email address";
  } else if (error.code === "auth/user-not-found") {
    return "No account found with this email";
  } else if (error.code === "auth/wrong-password") {
    return "Incorrect password. Please try again";
  } else if (error.code === "auth/invalid-credential") {
    return "Incorrect email or password. Please check your credentials and try again";
  } else if (error.code === "auth/network-request-failed") {
    return "Network error. Please check your internet connection";
  } else if (error.code === "auth/email-already-in-use") {
    return "Email already in use, please login";
  } else if (error.code === "auth/too-many-requests") {
    return "Too many failed attempts. Please try again later.";
  }
  return "Authentication failed. Please try again";
};

const handleSignupValidation = (email, password, name) => {
  if (!email.trim()) {
    Alert.alert("Please enter your email");
    return false;
  }
  if (!password.trim()) {
    Alert.alert("Please enter your password");
    return false;
  }
  if (!name.trim()) {
    Alert.alert("Please enter your Name");
    return false;
  }
  if (!emailRegex.test(email)) {
    Alert.alert("Please enter a valid email address");
    return false;
  }
  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters)) {
    Alert.alert("Invalid", PASSWORD_MESSAGE);
    return false;
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (!password.match(upperCaseLetters)) {
    Alert.alert("Invalid", PASSWORD_MESSAGE);
    return false;
  }

  // Validate numbers
  const numbers = /[0-9]/g;
  if (name.match(numbers)) {
    Alert.alert("Name should not contain numbers");
    return false;
  }

  // Validate length
  if (password.length <= 6) {
    Alert.alert("Invvalid", PASSWORD_MESSAGE);
    return false;
  }
  return true;
};

const handleLoginValidation = (email, password) => {
  if (!email.trim()) {
    Alert.alert("Please enter your email");
    return false;
  }
  if (!password.trim()) {
    Alert.alert("Please enter your password");
    return false;
  }
  if (!emailRegex.test(email)) {
    Alert.alert("Please enter a valid email address");
    return false;
  }
  return true;
};

const profileUpdateValidation = (name, email) => {
  if (!name) {
    Alert.alert("Missing Details", "Please enter your name");
    return false;
  }
  // Validate name
  const numbers = /[0-9]/g;
  if (name.match(numbers)) {
    Alert.alert("Name should not contain numbers");
    return false;
  }

  if (!email) {
    Alert.alert("Missing Details", "Please enter your email");
    return false;
  }
  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Alert.alert("Invalid", "Please enter a valid email address");
    return false;
  }
  return true;
};

// function to validate and update password
const validateAndUpdateUserPassword = async (
  user,
  newPassword,
  confirmPassword
) => {
  if (!newPassword) {
    Alert.alert("Missing Details", "Please enter new password");
    return false;
  }
  if (!confirmPassword) {
    Alert.alert("Missing Details", "Please confirm password");
    return false;
  }
  if (confirmPassword !== newPassword) {
    Alert.alert(
      "Password mismatch",
      "New password doesn't match with confirm password"
    );
    return false;
  }

  // Validate lowercase letters
  const lowerCaseLetters = /[a-z]/g;
  if (!newPassword.match(lowerCaseLetters)) {
    Alert.alert("Invalid", PASSWORD_MESSAGE);
    return false;
  }

  // Validate capital letters
  const upperCaseLetters = /[A-Z]/g;
  if (!newPassword.match(upperCaseLetters)) {
    Alert.alert("Invalid", PASSWORD_MESSAGE);
    return false;
  }

  // Validate length
  if (newPassword.length <= 6) {
    Alert.alert("Invalid", PASSWORD_MESSAGE);
    return false;
  }
  await updatePassword(user, newPassword);
  return true;
};

export {
  handleFirebaseAuthErrors,
  handleSignupValidation,
  handleLoginValidation,
  profileUpdateValidation,
  validateAndUpdateUserPassword,
};
