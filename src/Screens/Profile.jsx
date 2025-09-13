import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../Context/AuthContext";
import { profileUpdateValidation } from "../utils/AuthHandlers";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../Configs/firebaseConfig";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import { uploadProfileImgToCloudinary } from "../utils/tripData/uploadImage";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { imageUrl, name, email, uid, refreshUserData } = useAuth();
  const [displayName, setDisplayName] = useState(name);
  const [emailInput, setEmailInput] = useState(email);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(imageUrl || null);
  const [originalPhotoURL] = useState(imageUrl || null);
  const [isPhotoDeleted, setIsPhotoDeleted] = useState(false);
  const pickImage = async () => {
    try {
      setImgLoading(true);

      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access photo library is required to select images.",
          [{ text: "OK" }]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        setImageSelected(imageUri);
        setIsPhotoDeleted(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setImgLoading(false);
    }
  };

  const deletePhoto = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to remove your profile photo?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setImageSelected(null), setIsPhotoDeleted(true);
          },
        },
      ]
    );
  };
  const handleSaveChanges = async () => {
    if (!profileUpdateValidation(displayName.trim(), emailInput.trim())) return;
    try {
      setLoading(true);
      let imageUrl = null;
      let photoUpdated = false;

      // check if image was changed, added or removed
      const hasNewLocalImage =
        imageSelected && imageSelected.startsWith("file://");
      const wasPhotoDeleted = isPhotoDeleted && originalPhotoURL;
      if (hasNewLocalImage) {
        // Upload new image
        try {
          imageUrl = await uploadProfileImgToCloudinary(imageSelected, uid);
          if (!imageUrl) {
            throw new Error("Upload failed");
          }
          photoUpdated = true;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          Alert.alert(
            "Upload Error",
            "Failed to upload image. Please try again."
          );
          setLoading(false);
          return;
        }
      } else if (wasPhotoDeleted) {
        // Photo was deleted
        imageUrl = "";
        photoUpdated = true;
      }

      const nameUpdated = name === displayName.trim();
      const emailUpdated = email === emailInput.trim();

      // update name or email if changed
      if (nameUpdated || emailUpdated || photoUpdated) {
        const userDocRef = doc(db, "user", uid);
        const userDocToUpdate = {
          name: displayName.trim(),
          email: emailInput.trim(),
        };
        if (photoUpdated) {
          userDocToUpdate.imgUrl = imageUrl;
        }
        await updateDoc(userDocRef, userDocToUpdate);
        if (wasPhotoDeleted) {
          setIsPhotoDeleted(false);
        }
        await refreshUserData();
        Alert.alert("Success", "Profile updated successfully");
      } else {
        Alert.alert("No Changes", "No changes were made to your profile");
      }
    } catch (e) {
      if (e.code === "auth/operation-not-allowed") {
        Alert.alert(
          "Invalid action",
          "Please verify your credentials and try again"
        );
      } else {
        Alert.alert("Error", "Something went wrong please try again later");
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={pickImage}
            activeOpacity={0.8}
            style={styles.avatarContainer}
          >
            <View style={styles.avatar}>
              {imgLoading ? (
                <ActivityIndicator size={"small"} />
              ) : imageSelected ? (
                <Image
                  source={{ uri: imageSelected }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons name="person" size={40} color={COLOR.primary} />
              )}
            </View>

            <View style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={COLOR.primary} />
            </View>
          </TouchableOpacity>

          <View style={styles.avatarActions}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.changePhotoButton}
            >
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>

            {imageSelected && (
              <TouchableOpacity
                onPress={deletePhoto}
                style={styles.deletePhotoButton}
              >
                <Text style={styles.deletePhotoText}>Remove Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              placeholderTextColor={COLOR.placeholder}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={emailInput}
              onChangeText={setEmailInput}
              placeholder="Enter your email"
              placeholderTextColor={COLOR.placeholder}
            />
          </View>

          {/* Password Section */}
          <View style={styles.passwordSection}>
            <Text style={styles.sectionTitle}>Security</Text>
            <TouchableOpacity
              style={styles.passwordButton}
              onPress={() => setShowPasswordModal(true)}
            >
              <View style={styles.passwordButtonContent}>
                <Ionicons name="lock-closed" size={20} color={COLOR.primary} />
                <Text style={styles.passwordButtonText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLOR.grey} />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            {loading ? (
              <ActivityIndicator size={"large"} color={COLOR.primary} />
            ) : (
              <TouchableOpacity
                onPress={handleSaveChanges}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <ChangePasswordModal
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLOR.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLOR.stroke,
  },
  avatarActions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  changePhotoButton: {
    paddingVertical: 4,
  },
  changePhotoText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.primary,
  },
  deletePhotoButton: {
    paddingVertical: 4,
  },
  deletePhotoText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.error || "#FF4444",
  },
  formSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
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
  input: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    backgroundColor: "#FFFFFF",
  },
  passwordSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 16,
  },
  passwordButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  passwordButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  passwordButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
  },
  buttonSection: {
    marginTop: 32,
    gap: 12,
  },
  saveButton: {
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: "#FFFFFF",
  },
});

export default Profile;
