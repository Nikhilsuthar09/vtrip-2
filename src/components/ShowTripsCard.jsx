import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { Image } from "expo-image";
import SeparationLine from "./SeparationLine";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { useTravellerNames } from "../utils/firebaseTravellerHandler";
import { formatDate } from "../utils/calendar/handleCurrentDate";
import { useNavigation } from "@react-navigation/native";

const ShowTripsCard = ({
  id,
  title,
  destination,
  startDate,
  endDate,
  budget,
  createdBy,
  image,
  openModal,
}) => {
  const { travellerNames, travellerLoading, travellerError} =
    useTravellerNames(id);
  const navigation = useNavigation();
  const safeTravellerNames = travellerNames || [];

  if (travellerError) {
    Alert.alert("Error", "cannot load traveller names");
    return;
  }

  const handleMenuPress = (itemId) => {
    return (e) => {
      e.currentTarget.measure((x, y, width, height, pageX, pageY) => {
        openModal({
          x: pageX,
          y: pageY + height,
          width,
          height,
          itemId: itemId,
        });
      });
    };
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity style={styles.menuIcon} onPress={handleMenuPress(id)}>
          <Entypo name="dots-three-vertical" size={18} color={COLOR.grey} />
        </TouchableOpacity>

        <View style={styles.imgcontainer}>
          <Image
            style={styles.image}
            source={image || require("../../assets/default.jpg")}
            contentFit="cover"
            transition={500}
          />
        </View>
        <View style={styles.textcontainer}>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <FontAwesome name="map-marker" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.title}>
              {title} to {destination}
            </Text>
          </View>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="date-range" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.dates}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
          </View>
          <View style={styles.icon_text_container}>
            <View style={styles.iconContainer}>
              <FontAwesome name="inr" size={16} color={COLOR.grey} />
            </View>
            <Text style={styles.bugdet}>{budget}</Text>
          </View>
          <View style={styles.buttons}>
            <>
              {travellerLoading ? (
                <View style={styles.loadingButton}>
                  <MaterialIcons
                    name="hourglass-empty"
                    size={16}
                    color={COLOR.placeholder}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.loadingText}>Loading travellers...</Text>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.travellerButton}
                  onPress={() =>
                    navigation.navigate("traveller", {
                      id,
                      title,
                      destination,
                      startDate,
                      endDate,
                      createdBy,
                      budget,
                    })
                  }
                >
                  <MaterialIcons
                    name="people"
                    size={16}
                    color="#2196F3"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.travellerButtonText}>
                    {safeTravellerNames.length}{" "}
                    {safeTravellerNames.length === 1
                      ? "Traveller"
                      : "Travellers"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.planButton}
              onPress={() =>
                navigation.navigate("TopTabs", {
                  id,
                  budget,
                  destination,
                  startDate,
                  endDate,
                  createdBy,
                  budget,
                  safeTravellerNames,
                })
              }
            >
              <MaterialIcons
                name="flight-takeoff"
                size={16}
                color="#fff"
                style={styles.buttonIcon}
              />
              <Text style={styles.planButtontext}>Start Planning</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <SeparationLine />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 14,
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  imgcontainer: {
    width: 110,
    height: 110,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    backgroundColor: "#0553",
  },
  textcontainer: {
    flex: 2,
    gap: 6,
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 15,
    height: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  icon_text_container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuIcon: {
    position: "absolute",
    right: 16,
    top: 6,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  title: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
  },
  dates: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  bugdet: {
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    fontSize: FONT_SIZE.caption,
  },
  buttons: {
    justifyContent: "center",
    marginTop: 10,
    gap: 10,
  },
  buttonIcon: {
    marginRight: 8,
  },
  loadingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.stroke,
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.placeholder,
  },
  travellerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#edf2fd",
    borderWidth: 0.5,
    borderColor: "#2196F3",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  travellerButtonText: {
    fontFamily: FONTS.semiBold,
    color: "#2196F3",
    fontSize: FONT_SIZE.caption,
    textAlign: "center",
  },
  // Enhanced plan button
  planButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  planButtontext: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#fff",
    textAlign: "center",
  },
});
export default ShowTripsCard;
