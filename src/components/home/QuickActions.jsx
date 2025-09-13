import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";

const QuickActions = ({onInvitePress , onActionPress }) => {
    
  return (
    <View style={styles.quickActionsSection}>
      <View style={styles.quickActionsGrid}>
        <TouchableOpacity onPress={onInvitePress}  style={styles.actionButton}>
          <View style={styles.actionIcon}>
             <Ionicons name="person-add" size={22} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Invite</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Itinerary")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <FontAwesome6
              name="calendar-check"
              size={22}
              color={COLOR.primary}
            />
          </View>
          <Text style={styles.actionLabel}>Itinerary</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Expenses")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <FontAwesome name="inr" size={22} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Expenses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onActionPress("Packing")}
          style={styles.actionButton}
        >
          <View style={styles.actionIcon}>
            <Octicons name="checklist" size={22} color={COLOR.primary} />
          </View>
          <Text style={styles.actionLabel}>Packing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  quickActionsSection: {
    marginBottom: 20,
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    alignItems: "center",
    flex: 1,
  },
  actionIcon: {
    paddingBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.semiBold,
    color: COLOR.textSecondary,
  },
});

export default QuickActions;
