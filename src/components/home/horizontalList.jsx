import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Image } from "expo-image";

const HorizontalList = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.8} style={styles.recentTripCard}>
      <Image
        source={item.imageUrl || require("../../../assets/default.jpg")}
        style={styles.recentTripImage}
      />
      <View style={styles.recentTripInfo}>
        <Text style={styles.recentTripDate}>{item.date}</Text>
        <Text style={styles.recentTripLocation}>{item.destination}</Text>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  recentTripCard: {
    marginBottom: 10,
    width: 160,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  recentTripImage: {
    width: "100%",
    height: 95,
  },
  recentTripInfo: {
    padding: 15,
  },
  recentTripDate: {
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    marginBottom: 5,
  },
  recentTripLocation: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: "#1a1a1a",
  },
});

export default HorizontalList;
