import { View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const AirplaneLoading = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFF",
      }}
    >
      <LottieView
        style={{ width: 200, height: 200 }}
        source={require("../../assets/airplaneLoader.json")}
        autoPlay
        loop
      />
    </View>
  );
};

export default AirplaneLoading;
