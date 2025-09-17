import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import {
  addExpense,
  updateExpense,
} from "../../utils/firebase_crud/expenses/expenseCrud";

const PlanInAdvanceModal = ({
  tripId,
  isVisible,
  onClose,
  onBackButtonPress,
  itemToUpdate,
}) => {
  const [expenseType, setExpenseType] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef(null);

  const resetAndClose = () => {
    setExpenseType("");
    setAmount("");
    onClose();
  };
  useEffect(() => {
    if (!isVisible) return;
    if (itemToUpdate) {
      setExpenseType(itemToUpdate.expenseType);
      setAmount(String(itemToUpdate.amount));
    }
  }, [itemToUpdate, isVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const addItem = async () => {
    const newExpense = {
      expenseType: expenseType.trim(),
      amount: parseFloat(amount.trim()),
    };
    await addExpense(tripId, newExpense, "plannedExpenses");
  };
  const handleSubmitExpense = async () => {
    if (!expenseType.trim()) {
      Alert.alert("Error", "Please enter an expense type");
      return;
    }
    if (
      !amount.trim() ||
      isNaN(parseFloat(amount)) ||
      parseFloat(amount) <= 0
    ) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    setIsLoading(true);
    if (itemToUpdate) {
      await updateItem();
    } else {
      await addItem();
    }
    setIsLoading(false);
    resetAndClose();
  };
  const updateItem = async () => {
    // update the expense
    const expense = {
      expenseType: expenseType.trim(),
      amount: parseFloat(amount.trim()),
    };
    await updateExpense(tripId, itemToUpdate.id, expense, "plannedExpenses");
  };

  // Function to dismiss keyboard when tapping outside inputs
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBackButtonPress}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={dismissKeyboard}
      >
        <View
          style={[
            styles.modalContainer,
            { marginBottom: keyboardHeight > 0 ? keyboardHeight - 22 : 0 },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.heading}>Plan an Expense</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={resetAndClose}
              >
                <Ionicons name="close" size={24} color={COLOR.grey} />
              </TouchableOpacity>
            </View>

            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {/* Expense Type Input */}
              <Text style={styles.label}>Expense Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Hotel, Food, Transport"
                placeholderTextColor={COLOR.placeholder}
                value={expenseType}
                onChangeText={setExpenseType}
                maxLength={50}
              />

              {/* Amount Input */}
              <Text style={styles.label}>Amount (in ₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 5000"
                placeholderTextColor={COLOR.placeholder}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {/* Add Button */}
              {isLoading ? (
                <ActivityIndicator size={"large"} />
              ) : (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    (!expenseType.trim() || !amount.trim()) &&
                      styles.addButtonDisabled,
                  ]}
                  onPress={handleSubmitExpense}
                  disabled={!expenseType.trim() || !amount.trim()}
                >
                  <Text style={styles.addButtonText}>
                    {itemToUpdate ? "Update" : "Add Expense"}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetAndClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    position: "relative",
  },
  modalContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: FONT_SIZE.H4,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  label: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLOR.stroke,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    backgroundColor: "#F9FAFB",
  },
  addButton: {
    flexDirection: "row",
    backgroundColor: COLOR.primary,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: COLOR.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  addButtonDisabled: {
    backgroundColor: COLOR.grey,
    shadowOpacity: 0,
    elevation: 0,
  },
  addButtonText: {
    color: "#fff",
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  cancelButtonText: {
    color: COLOR.grey,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.bodyLarge,
  },
});

export default PlanInAdvanceModal;
