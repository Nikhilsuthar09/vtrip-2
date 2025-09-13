import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { COLOR, FONTS } from "../../constants/Theme";

const ProgressBar = ({ progress, totalitems }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{totalitems} {totalitems === 1 ? "item" : "items"}</Text>
      <View style={styles.progressContainer}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.percentageText}>{`${Math.floor(progress * 100)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent:"center",
    gap:8,
    backgroundColor:"#fff",
    paddingVertical:4,
    paddingHorizontal:4,
    borderRadius:10,
    marginBottom:10,
  },
  progressContainer: {
    height: 10,
    width: "55%",
    backgroundColor: COLOR.stroke,
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },
  label: {
    fontFamily: FONTS.bold,
  },
  progress: {
    height: "100%",
    backgroundColor: COLOR.primary,
  },
  percentageText:{
    fontFamily:FONTS.medium,
    color:COLOR.grey
  }
});

export default ProgressBar;
