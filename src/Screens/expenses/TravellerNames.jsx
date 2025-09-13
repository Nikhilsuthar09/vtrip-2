import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { COLOR, FONTS } from "../../constants/Theme";
import { getTitleCase } from "../../utils/common/processUserData";

const TravellerNames = ({ name, selectedName, setSelectedName, id }) => {
  const toggle = (id) => {
    setSelectedName((prev) => (prev === id ? "" : id));
  };
  return (
    <TouchableOpacity
      key={id}
      onPress={() => toggle(id)}
      style={[
        styles.container,
        id === selectedName && { backgroundColor: COLOR.primary },
      ]}
    >
      <Text style={[styles.text, id === selectedName && { color: "#fff" }]}>
        {getTitleCase(name)}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: COLOR.primaryLight,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLOR.primary,
  },
  text: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: COLOR.primary,
    fontFamily: FONTS.medium,
  },
});

export default TravellerNames;
