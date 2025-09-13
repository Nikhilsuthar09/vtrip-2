import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

const NotificationPlaceholder = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="notifications-outline" size={80} color={COLOR.grey} />
      </View>

      <Text style={styles.title}>No Notifications Yet</Text>

      <Text style={styles.description}>
        You're all caught up! When you receive notifications, they'll appear
        here.
      </Text>

      {/* Optional: Add some visual elements */}
      <View style={styles.decorativeElements}>
        <View style={[styles.dot, { backgroundColor: "#E5E7EB" }]} />
        <View style={[styles.dot, { backgroundColor: "#D1D5DB" }]} />
        <View style={[styles.dot, { backgroundColor: "#E5E7EB" }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    backgroundColor: "#F8FAFC",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
  },
  title: {
    fontSize: FONT_SIZE.titleLarge,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  decorativeElements: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default NotificationPlaceholder;
