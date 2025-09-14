import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const GoogleLoader = ({ visible = true }) => {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <LottieView
          style={styles.lottie}
          source={require("../../assets/google_loading.json")}
          autoPlay
          loop
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  loaderContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

export default GoogleLoader;
