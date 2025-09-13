import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONTS } from "../constants/Theme";

const Placeholder = ({onPress}) => {
  return (
    <View style={styles.container}>
      {/* <Image
        source={require("../assets/empty-packing.png")} 
        style={styles.image}
        resizeMode="contain"
      /> */}
      <Text style={styles.title}>No Items Packed</Text>
      <Text style={styles.subtitle}>
        Looks like you haven’t added any items yet. Start planning your packing
        list to stay organized.
      </Text>
      <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
        <Ionicons name="add" size={18} color="#fff" />
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "#fff", 
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    color: COLOR.grey,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: FONTS.medium,
    fontSize: 14,
    marginLeft: 6,
  },
})

export default Placeholder;
