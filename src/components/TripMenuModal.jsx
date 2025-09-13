import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const { width, height } = Dimensions.get("window");

const TripMenuModal = ({
  selectedId,
  visible,
  closeModal,
  position,
  onDelete,
  onEdit,
  onInvite
}) => {
  if (!visible) return null;

  const getModalPosition = () => {
    if (!position) {
      return {
        top: 50,
        right: 30,
      };
    }

    const modalHeight = 120;
    const margin = 8;

    let top = position.y + margin;
    let right = width - position.x - position.width + margin;

    if (top + modalHeight > height) {
      top = position.y - modalHeight - margin;
    }
    if (right < 0) {
      right = margin;
    }
    return { top, right };
  };
  const modalPosition = getModalPosition();
  const handleDelete = () => {
    if (onDelete && selectedId) {
      onDelete(selectedId);
    }
    closeModal();
  };
  const handleEdit = () => {
    if (onEdit && selectedId) {
      onEdit(selectedId);
    }
    closeModal();
  };
  const handleInvite = () => {
    if (onInvite && selectedId) {
      onInvite(selectedId);
    }
    closeModal();
  };
  return (
    <>
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={closeModal} />
      <View style={[styles.container, modalPosition]}>
        <TouchableOpacity onPress={handleInvite} style={styles.iconTextContainer}>
          <Entypo name="share" size={18} color={COLOR.primary} />
          <Text style={styles.text}>Invite</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.iconTextContainer}>
          <Feather name="edit" size={18} color={COLOR.primary} />
          <Text style={styles.text}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          style={styles.iconTextContainer}
        >
          <AntDesign name="delete" size={18} color={COLOR.primary} />
          <Text style={styles.text}>Delete</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
    zIndex: 100,
  },
  container: {
    position: "absolute",
    zIndex: 101,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingLeft: 10,
    paddingRight: 60,
    borderRadius: 8,
    gap: 16,
    elevation: 10,
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  text: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: COLOR.textSecondary,
  },
});

export default TripMenuModal;
