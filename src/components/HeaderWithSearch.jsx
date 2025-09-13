import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { FontAwesome } from "@expo/vector-icons";
import SeparationLine from "./SeparationLine";
import { useAuth } from "../Context/AuthContext";
import { getuserNameChars } from "../utils/common/processUserData";

const HeaderWithSearch = ({ openDrawer, searchText, setSearchText }) => {
  const { imageUrl, name } = useAuth();
  return (
    <>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search destination..."
            placeholderTextColor={COLOR.placeholder}
            value={searchText}
            onChangeText={(value) => setSearchText(value)}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <FontAwesome name="search" size={18} color={COLOR.grey} />
        </View>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 50,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
            borderColor: COLOR.primary,
          }}
        >
          <TouchableOpacity onPress={openDrawer} style={styles.userButton}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
            ) : name ? (
              <Text
                style={{
                  fontFamily: FONTS.semiBold,
                  color: "#fff",
                  fontSize: FONT_SIZE.body,
                }}
              >
                {getuserNameChars(name)}
              </Text>
            ) : (
              <FontAwesome name="user-o" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <SeparationLine />
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 50,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    height: 45,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
    fontFamily: FONTS.regular,
    height: "100%",
    marginRight: 8,
  },
  userButton: {
    backgroundColor: COLOR.primary,
    width: 42,
    height: 42,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    overflow: "hidden",
  },
});
export default HeaderWithSearch;
