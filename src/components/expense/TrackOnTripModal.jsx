import {
  View,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";

const TrackOnTripModal = ({
  itemIdToUpdate,
  modalVisible,
  onclose,
  handleDataChange,
  expenseDataOnTrip,
  onSubmit,
  traveller,
  isLoading
}) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={onclose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.modalTitle}>
              {itemIdToUpdate ? "Update" : "Add"} Expense
            </Text>
            <AntDesign
              style={styles.closeButton}
              onPress={onclose}
              name="close"
              size={24}
              color={COLOR.primary}
            />
          </View>
          {/* Dropdown */}
          <Text style={styles.inputLabel}>Paid By</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={expenseDataOnTrip.uid}
              onValueChange={(uid) => {
                const selectedTraveller = traveller.find((t) => t.uid === uid);
                handleDataChange("name", selectedTraveller?.name);
                handleDataChange("uid", uid);
              }}

              style={styles.picker}
            >
              <Picker.Item
                label="Select"
                style={{ color: COLOR.placeholder, backgroundColor:"#fff" }}
              />
              {traveller.map((item) => {
                return (
                  <Picker.Item
                    key={item.uid}
                    label={item.name}
                    value={item.uid}
                    style={{ color: COLOR.textPrimary, backgroundColor:"#fff" }}
                  />
                );
              })}
            </Picker>
          </View>

          {/* Expense Name */}
          <Text style={styles.inputLabel}>Expense Type</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Lunch"
            placeholderTextColor={COLOR.placeholder}
            value={expenseDataOnTrip.expenseType}
            onChangeText={(value) => handleDataChange("expenseType", value)}
          />

          {/* Amount */}
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 200"
            placeholderTextColor={COLOR.placeholder}
            keyboardType="numeric"
            value={expenseDataOnTrip.amount}
            onChangeText={(value) => handleDataChange("amount", value)}
          />

          {/* Submit Button */}
          {isLoading ? (
            <ActivityIndicator size={"large"}/>
          ) : (
            <TouchableOpacity activeOpacity={0.8} style={styles.addButton} onPress={onSubmit}>
            <Text style={styles.addButtonText}>
            {itemIdToUpdate ? "Update" : "Add"}
            </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textSecondary,
    marginTop: 10,
    marginBottom: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
  },
  picker: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 8,
    paddingHorizontal: 12,
    padding: 18,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
  },
  addButton: {
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
  },
});

export default TrackOnTripModal;
