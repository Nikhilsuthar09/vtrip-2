import { StyleSheet, Text, View } from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";

const EmptyItineraryPlaceholder = () => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="calendar-outline" size={64} color={COLOR.placeholder} />
      </View>
      <Text style={styles.emptyTitle}>No plans yet</Text>
      <Text style={styles.emptySubtitle}>
        Start building your itinerary by adding your first activity
      </Text>
      <View style={styles.suggestionContainer}>
        <Text style={styles.suggestionText}>
          Tap the + button to get started
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconContainer: {
    marginBottom: 24,
    opacity: 0.6,
  },
  emptyTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H6,
    color: COLOR.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  suggestionContainer: {
    backgroundColor: COLOR.background || "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  suggestionText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: COLOR.primary,
    textAlign: "center",
  },
});

export default EmptyItineraryPlaceholder;
