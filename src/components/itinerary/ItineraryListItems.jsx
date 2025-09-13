import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { formatTime } from "../../utils/timestamp/formatAndGetTime";

const ItineraryListItem = ({ item, index, totalItems, onMenuPress }) => {
  const isLast = index === totalItems - 1;
  const isFirst = index === 0;

  return (
    <View style={styles.itemContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(item.time)}</Text>
      </View>

      <View style={styles.timelineContainer}>
        <View
          style={[
            styles.timelineDot,
            isFirst ? styles.firstDot : styles.regularDot,
            item.isCompleted && styles.completedDot,
          ]}
        />
        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.subtitleText}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity
        onPress={(event) => onMenuPress(item, event)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={styles.actionContainer}
      >
        <Entypo name="dots-three-vertical" size={16} color={COLOR.grey} />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    marginBottom: 24,
    alignItems: "flex-start",
  },
  timeContainer: {
    width: 80,
    paddingTop: 4,
  },
  timeText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: "#6c757d",
  },
  timelineContainer: {
    alignItems: "center",
    marginHorizontal: 16,
    paddingTop: 4,
    position: "relative",
    width: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
    position: "relative",
  },
  firstDot: {
    backgroundColor: COLOR.primary,
  },
  regularDot: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: COLOR.stroke,
  },
  completedDot: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },
  timelineLine: {
    width: 2,
    backgroundColor: COLOR.stroke,
    position: "absolute",
    top: 12,
    bottom: -24,
    left: 7,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 2,
  },
  titleText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.bodyLarge,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  subtitleText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    lineHeight: 20,
  },
  actionContainer: {
    paddingTop: 4,
    paddingRight: 8,
  },
});
export default ItineraryListItem;
