import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";

const ImagePickerComponent = ({
  onImageSelected,
  selectedImage,
  placeholder = "Add Trip Image",
}) => {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      setLoading(true);

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
        aspect: [3, 2],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        onImageSelected(imageUri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    Alert.alert("Remove Image", "Are you sure you want to remove this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => onImageSelected(null),
      },
    ]);
  };
  return (
    <View style={styles.container}>
      {selectedImage ? (
        <TouchableOpacity activeOpacity={0.8} style={styles.imageContainer} onPress={pickImage}>
          <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
          <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
          onPress={pickImage}
          disabled={loading}
        >
          <MaterialIcons
            name="add-photo-alternate"
            size={32}
            color={loading ? COLOR.grey : COLOR.primary}
          />
          <Text
            style={[
              styles.uploadButtonText,
              loading && styles.uploadButtonTextDisabled,
            ]}
          >
            {loading ? "Loading..." : placeholder}
          </Text>
          <Text style={styles.uploadSubText}>Tap to select from gallery</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: COLOR.stroke,
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.stroke + "10",
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
    marginTop: 8,
  },
  uploadButtonTextDisabled: {
    color: COLOR.grey,
  },
  uploadSubText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    marginTop: 4,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: COLOR.stroke,
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: COLOR.danger,
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

});

export default ImagePickerComponent;
