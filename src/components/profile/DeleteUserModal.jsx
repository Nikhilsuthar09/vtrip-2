import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useAuth } from "../../Context/AuthContext";
import { deleteUserDataInDb } from "../../utils/removeUserAccount";
import { handleFirebaseAuthErrors } from "../../utils/AuthHandlers";
import SeparationLine from "../SeparationLine";
import { Image } from "expo-image";
import {
  getGoogleCredentialForReauth,
  signInGoogle,
} from "../../utils/googleSignin";
import AirplaneLoading from "../AirplaneLoading";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const DeleteUserModal = ({ visible, onClose }) => {
  const { user, uid } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [googleButtonLoading, setgoogleButtonLoading] = useState(false);

  if (googleButtonLoading) {
    return <AirplaneLoading />;
  }

  const validateInputs = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return false;
    }
    if (!password.trim()) {
      Alert.alert("Error", "Please enter your password");
      return false;
    }
    if (email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
      Alert.alert("Error", "Email address does not match your account");
      return false;
    }
    return true;
  };

  const handleDeleteAccount = async () => {
    if (!validateInputs()) return;

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(
        email.trim(),
        password.trim()
      );
      await reauthenticateWithCredential(user, credential);

      await deleteUserDataInDb(uid);
      await deleteUser(user);
      // Close modal and clear fields
      handleClose();
      console.log("User account deleted successfully");
    } catch (error) {
      console.error("Delete account error:", error);

      let errorMessage = handleFirebaseAuthErrors(error);

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleGooglePress = async () => {
    try {
      setgoogleButtonLoading(true);
      await GoogleSignin.signOut();
      const googleCredential = await getGoogleCredentialForReauth();
      await reauthenticateWithCredential(user, googleCredential);

      await deleteUserDataInDb(uid);
      await deleteUser(user);
      // Close modal and clear fields
      handleClose();
      console.log("User account deleted successfully");
    } catch (error) {
      console.error("Delete account error:", error);

      let errorMessage = handleFirebaseAuthErrors(error);

      Alert.alert("Error", errorMessage);
    } finally {
      setgoogleButtonLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    onClose();
  };
  const GoogleSignInButton = ({ onPress, disabled = false, style }) => {
    return (
      <TouchableOpacity
        style={[styles.googleButton, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContent}>
          <View style={styles.googleIconColored}>
            <Image
              style={{ width: 22, height: 23 }}
              source={require("../../../assets/google.svg")}
            />
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Delete Account</Text>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color={COLOR.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Warning Message */}
              <View style={styles.warningContainer}>
                <Ionicons name="warning" size={24} color={COLOR.danger} />
                <Text style={styles.warningText}>
                  This action is permanent and cannot be undone. All your data
                  will be deleted.
                </Text>
              </View>

              {/* Confirmation Text */}
              <Text style={styles.confirmationText}>
                Please sign in to confirm account deletion:
              </Text>
              <GoogleSignInButton
                onPress={handleGooglePress}
                disabled={googleButtonLoading}
                style={{ marginBottom: 16 }}
              />
              <SeparationLine />

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor={COLOR.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={COLOR.placeholder}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                    disabled={loading}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color={COLOR.grey}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={[styles.button, styles.cancelButton]}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleDeleteAccount}
                  style={[styles.button, styles.deleteButton]}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.deleteButtonText}>Delete Account</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardAvoidingView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 20,
    width: "90%",
    maxWidth: 400,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.danger,
  },
  warningText: {
    flex: 1,
    marginLeft: 8,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.danger,
    lineHeight: 20,
  },
  confirmationText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    backgroundColor: "#fff",
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
  },
  deleteButton: {
    backgroundColor: COLOR.danger,
  },
  deleteButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: "#fff",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLOR.stroke || "#e1e5e9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
    backgroundColor: "#f8f9fa",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  googleIconColored: {
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  googleButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    textAlign: "center",
  },
});

export default DeleteUserModal;
