import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { validateAndUpdateUserPassword } from "../../utils/AuthHandlers";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { useAuth } from "../../Context/AuthContext";

const ChangePasswordModal = ({ visible, onClose }) => {
  const { user, email } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Missing Information", "Please fill in all password fields");
      return;
    }

    setLoading(true);
    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Validate and update password
      const passwordUpdated = await validateAndUpdateUserPassword(
        user,
        newPassword.trim(),
        confirmPassword.trim()
      );

      if (passwordUpdated) {
        Alert.alert("Success", "Password updated successfully");
        handleClose();
      }
    } catch (error) {
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert("Wrong Password", "Your current password is incorrect");
      } else {
        Alert.alert("Error", "Something went wrong. Please try again later");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={COLOR.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Current Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={COLOR.placeholder}
                secureTextEntry={!showCurrentPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showCurrentPassword ? "eye" : "eye-off"}
                  size={20}
                  color={COLOR.grey}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password"
                placeholderTextColor={COLOR.placeholder}
                secureTextEntry={!showNewPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNewPassword(!showNewPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showNewPassword ? "eye" : "eye-off"}
                  size={20}
                  color={COLOR.grey}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={COLOR.placeholder}
                secureTextEntry={!showConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color={COLOR.grey}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <Text style={styles.requirementsText}>
              • At least 6 characters{"\n"}• One lowercase letter{"\n"}• One
              uppercase letter
            </Text>
          </View>
        </View>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleChangePassword}
            style={[
              styles.changePasswordButton,
              loading && styles.disabledButton,
            ]}
            disabled={loading}
          >
            <Text style={styles.changePasswordButtonText}>
              {loading ? "Updating..." : "Change Password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleClose}
            style={styles.cancelButton}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLOR.stroke,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  requirementsContainer: {
    backgroundColor: COLOR.primaryLight,
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
  },
  requirementsTitle: {
    fontSize: FONT_SIZE.bodySmall,
    fontFamily: FONTS.semiBold,
    color: COLOR.primary,
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    gap: 12,
  },
  changePasswordButton: {
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: COLOR.grey,
  },
  changePasswordButtonText: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
  },
});

export default ChangePasswordModal;
