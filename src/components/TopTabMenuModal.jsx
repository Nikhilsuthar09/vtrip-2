import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";

const TopTabMenuModal = ({ visible, onClose, tripData }) => {
  const menuItems = [
    {
      id: "invite",
      title: "Invite",
      icon: "person-add",
      iconType: "MaterialIcons",
      color: COLOR.textPrimary,
    },
    {
      id: "travellers",
      title: "View Travellers",
      icon: "groups-2",
      iconType: "MaterialIcons",
      color: COLOR.textPrimary,
    },
  ];

  const handleItemPress = (item) => {
    onClose();

    if (item.id === "delete") {
      Alert.alert(
        "Delete Trip",
        "Are you sure you want to delete this trip? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => handleMenuItemPress(item.id, tripData),
          },
        ]
      );
    } else {
      handleMenuItemPress(item.id, tripData);
    }
  };

  const renderIcon = (item) => {
    if (item.iconType === "FontAwesome5") {
      return <FontAwesome5 name={item.icon} size={20} color={item.color} />;
    }
    return <MaterialIcons name={item.icon} size={20} color={item.color} />;
  };
  const handleMenuItemPress = (action, tripData) => {
    const nav = tripData.navigation;
    switch (action) {
      case "invite":
        nav.navigate("invite", {
          id: tripData.id,
          title: tripData.title,
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          travellers: tripData.safeTravellerNames,
          createdBy: tripData.createdBy,
        });
        break;
      case "travellers":
        nav.navigate("traveller", {
          id: tripData.id,
          title: tripData.title,
          destination: tripData.destination,
          startDate: tripData.startDate,
          endDate: tripData.endDate,
          createdBy: tripData.createdBy,
        });
        break;

      default:
        break;
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}></Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <MaterialIcons name="close" size={24} color={COLOR.grey} />
                </TouchableOpacity>
              </View>

              <View style={styles.menuItems}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index === menuItems.length - 1 && styles.lastMenuItem,
                    ]}
                    onPress={() => handleItemPress(item)}
                  >
                    <View style={styles.menuItemContent}>
                      {renderIcon(item)}
                      <Text
                        style={[
                          styles.menuItemText,
                          item.color === COLOR.danger && {
                            color: COLOR.danger,
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "65%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    marginTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  menuItems: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginLeft: 16,
  },
});

export default TopTabMenuModal;
