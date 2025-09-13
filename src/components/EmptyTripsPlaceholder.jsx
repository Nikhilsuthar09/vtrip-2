import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const EmptyTripsPlaceholder = ({ onAddTrip, searchText }) => {
  const isSearching = searchText.trim() !== "";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {isSearching ? (
          <FontAwesome name="search" size={80} color={COLOR.grey} />
        ) : (
          <MaterialIcons name="luggage" size={80} color={COLOR.grey} />
        )}
      </View>

      <Text style={styles.title}>
        {isSearching ? "No trips found" : "No trips yet"}
      </Text>

      <Text style={styles.subtitle}>
        {isSearching
          ? `No trips match "${searchText}". Try a different search term.`
          : "Start planning your next adventure! Create your first trip or join an existing one."}
      </Text>

      {!isSearching && (
        <TouchableOpacity style={styles.addButton} onPress={onAddTrip}>
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Your First Trip</Text>
        </TouchableOpacity>
      )}

      {!isSearching && (
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <MaterialIcons name="group" size={24} color={COLOR.primary} />
            <Text style={styles.featureText}>Plan with friends</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="calendar" size={24} color={COLOR.primary} />
            <Text style={styles.featureText}>Set travel dates</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="inr" size={24} color={COLOR.primary} />
            <Text style={styles.featureText}>Track budget</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.7,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontFamily: FONTS.bold,
    color: COLOR.primary,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  addButton: {
    backgroundColor: COLOR.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 40,
    elevation: 2,
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.md,
    fontFamily: FONTS.semiBold,
    marginLeft: 8,
  },
  featuresContainer: {
    width: "100%",
    gap: 16,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.primary,
  },
  featureText: {
    fontSize: FONT_SIZE.sm,
    fontFamily: FONTS.medium,
    color: COLOR.primary,
    marginLeft: 12,
  },
});

export default EmptyTripsPlaceholder;
