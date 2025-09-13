import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getExpenseColor } from "../../utils/expenses/getExpenseColor";
import { Ionicons } from "@expo/vector-icons";
import { formatLastEdited } from "../../utils/timestamp/formatAndGetTime";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

// render item with better UI
export const renderItem = ({
  item,
  index,
  handleLongPress,
  handleItemPress,
}) => {
  const expenseColor = getExpenseColor(item.paidBy);

  return (
    <TouchableOpacity
      onLongPress={() => handleLongPress(item.id, item.expenseType)}
      onPress={() =>
        handleItemPress(item.id,item.uid, item.paidBy, item.expenseType, item.amount)
      }
      style={[styles.expenseItem, index === 0 && styles.firstItem]}
      activeOpacity={0.7}
    >
      {/* Left colored indicator */}
      <View
        style={[styles.expenseIndicator, { backgroundColor: expenseColor }]}
      />

      {/* Main content */}
      <View style={styles.expenseContent}>
        <View style={styles.expenseHeader}>
          <Text style={styles.expenseType} numberOfLines={1}>
            {item.expenseType}
          </Text>
          <Text style={styles.expenseAmount}>
            ₹
            {parseFloat(item.amount).toLocaleString("en-IN", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </Text>
        </View>

        <View style={styles.expenseFooter}>
          <View style={styles.paidBySection}>
            <Ionicons name="person-outline" size={14} color={COLOR.grey} />
            <Text style={styles.paidBy} numberOfLines={1}>
              {item.paidBy}
            </Text>
          </View>
          <View style={styles.timestampSection}>
            <Ionicons name="time-outline" size={14} color={COLOR.grey} />
            <Text style={styles.timestamp}>
              {formatLastEdited(item.updatedAt)}
            </Text>
          </View>
        </View>
      </View>

      {/* Right arrow */}
      <Ionicons
        name="chevron-forward-outline"
        size={20}
        color={COLOR.grey}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  expensesList: {
    paddingBottom: 20,
  },
  firstItem: {
    marginTop: 8,
  },
  expenseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F5F5F5",
  },
  expenseIndicator: {
    width: 4,
    height: "100%",
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  expenseContent: {
    flex: 1,
    padding: 16,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  expenseType: {
    flex: 1,
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginRight: 12,
    textTransform: "capitalize",
  },
  expenseAmount: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.bold,
    color: COLOR.primary,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paidBySection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  paidBy: {
    marginLeft: 4,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
  },
  timestampSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    marginLeft: 4,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },
  chevronIcon: {
    marginRight: 16,
  },
});
