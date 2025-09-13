import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import TrackOnTripModal from "../../components/expense/TrackOnTripModal";
import { useOnTripExpense } from "../../utils/firebaseTripHandler";
import Spinner from "../../components/Spinner";
import ErrorScreen from "../../components/ErrorScreen";
import TravellerNames from "./TravellerNames";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "../../utils/firebase_crud/expenses/expenseCrud";
import { renderItem } from "../../components/expense/RenderOnTripExpenseList";
import { getfirstName } from "../../utils/common/processUserData";

const TrackOnTrip = ({ route }) => {
  const { id, budget, safeTravellerNames, travellerLoading } = route.params;
  const tripId = id || "";
  const safeBudget = budget || "";
  const { onTripExpenseData, loading, error } = useOnTripExpense(tripId);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedName, setSelectedName] = useState("");
  const [expenseDataOnTrip, setExpenseDataOnTrip] = useState({
    uid: "",
    name: "",
    expenseType: "",
    amount: "",
  });
  const [itemIdToUpdate, setItemIdToUpdate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (loading) return <Spinner />;
  if (error) {
    return <ErrorScreen />;
  }
  const safeTripData = onTripExpenseData || [];
  const expenseList = selectedName
    ? safeTripData.filter((item) => item.uid === selectedName)
    : safeTripData;

  const totalExpenses = expenseList.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);
  const budgetPercentage = Math.min((totalExpenses / safeBudget) * 100, 100);
  const remaining = parseFloat(safeBudget) - totalExpenses;
  const isOverBudget = remaining < 0;

  const handleExpenseDataChange = (field, value) => {
    setExpenseDataOnTrip((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleModal = () => {
    if (modalVisible) {
      resetData();
    }
    setModalVisible(!modalVisible);
  };

  const resetData = () => {
    setItemIdToUpdate("");
    setExpenseDataOnTrip({
      uid: "",
      name: "",
      expenseType: "",
      amount: "",
    });
  };

  const onSubmit = async () => {
    const amount = parseFloat(expenseDataOnTrip.amount.trim());
    if (
      !expenseDataOnTrip.name.trim() ||
      expenseDataOnTrip.name.trim() === "Select"
    ) {
      Alert.alert("Invalid input", "Please select a name");
      return;
    }
    if (!expenseDataOnTrip.expenseType.trim()) {
      Alert.alert("Missing field!", "Please enter an expense type");
      return;
    }
    if (!amount) {
      Alert.alert("Missing field!", "Please enter an amount");
      return;
    }
    if (isNaN(amount) || amount < 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount");
      return;
    }
    setIsLoading(true);
    if (itemIdToUpdate) {
      await updateItem();
    } else {
      await handleAddExpense();
    }
    setIsLoading(false);
    resetData();
    setModalVisible(false);
  };

  const updateItem = async () => {
    const itemToUpdate = {
      uid: expenseDataOnTrip.uid.trim(),
      paidBy: expenseDataOnTrip.name.trim(),
      expenseType: expenseDataOnTrip.expenseType.trim(),
      amount: parseFloat(expenseDataOnTrip.amount.trim()),
    };
    await updateExpense(
      tripId,
      itemIdToUpdate,
      itemToUpdate,
      (expensePathName = "onTripExpenses")
    );
  };

  const handleAddExpense = async () => {
    const newExpense = {
      uid: expenseDataOnTrip.uid.trim(),
      paidBy: expenseDataOnTrip.name.trim(),
      expenseType: expenseDataOnTrip.expenseType.trim(),
      amount: parseFloat(expenseDataOnTrip.amount.trim()),
    };
    await addExpense(tripId, newExpense, (expensePathName = "onTripExpenses"));
  };

  const handleLongPress = (itemId, expense) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${expense}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteExpense(tripId, itemId, "onTripExpenses");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleItemPress = (id, uid, name, category, amount) => {
    setItemIdToUpdate(id);
    setExpenseDataOnTrip({
      uid,
      name,
      expenseType: category,
      amount: amount.toString(),
    });
    toggleModal();
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        stickyHeaderIndices={[1]} // Makes the travellers section sticky
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header Section */}
        <View style={styles.headerSection}>
          {/* Progress bar with enhanced styling */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Budget Progress</Text>
              <Text style={styles.progressPercentage}>
                {Math.round(budgetPercentage)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: isOverBudget
                      ? COLOR.danger + "20"
                      : COLOR.primaryLight + "30",
                  },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${budgetPercentage}%`,
                      backgroundColor: isOverBudget
                        ? COLOR.danger
                        : COLOR.primary,
                    },
                  ]}
                />
              </View>
            </View>
            {isOverBudget && (
              <View style={styles.overBudgetBadge}>
                <Ionicons
                  name="warning-outline"
                  size={16}
                  color={COLOR.danger}
                />
                <Text style={styles.overBudgetText}>Over Budget!</Text>
              </View>
            )}
          </View>

          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, styles.expenseCard]}>
              <View style={styles.summaryIconContainer}>
                <Ionicons
                  name="trending-up-outline"
                  size={24}
                  color={COLOR.primary}
                />
              </View>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: isOverBudget ? COLOR.danger : COLOR.textPrimary },
                ]}
              >
                ₹{totalExpenses.toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.budgetCard]}>
              <View style={styles.summaryIconContainer}>
                <Ionicons name="wallet-outline" size={24} color={COLOR.grey} />
              </View>
              <Text style={styles.summaryLabel}>Budget</Text>
              <Text style={styles.summaryValue}>
                ₹{safeBudget?.toLocaleString("en-IN")}
              </Text>
            </View>

            <View style={[styles.summaryCard, styles.remainingCard]}>
              <View style={styles.summaryIconContainer}>
                <Ionicons
                  name={
                    isOverBudget
                      ? "alert-circle-outline"
                      : "checkmark-circle-outline"
                  }
                  size={24}
                  color={
                    isOverBudget ? COLOR.danger : COLOR.success || "#4CAF50"
                  }
                />
              </View>
              <Text style={styles.summaryLabel}>
                {isOverBudget ? "Over by" : "Remaining"}
              </Text>
              <Text
                style={[
                  styles.summaryValue,
                  {
                    color: isOverBudget
                      ? COLOR.danger
                      : COLOR.success || "#4CAF50",
                  },
                ]}
              >
                ₹{Math.abs(remaining).toLocaleString("en-IN")}
              </Text>
            </View>
          </View>
        </View>

        {/* sticky Travellers Section */}
        <View style={styles.travellersSection}>
          <View style={styles.travellersHeader}>
            <Text style={styles.sectionTitle}>Travellers</Text>
            <Text style={styles.sectionDescription}>
              Tap on any traveller to view their individual expenses
            </Text>
          </View>
          {travellerLoading ? (
            <ActivityIndicator
              size="small"
              color={COLOR.primary}
              style={styles.travellerLoader}
            />
          ) : (
            <FlatList
              data={safeTravellerNames}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => {
                return (
                  <TravellerNames
                    setSelectedName={setSelectedName}
                    selectedName={selectedName}
                    name={item.name ? getfirstName(item.name) : "User"}
                    id={item.uid}
                  />
                );
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.travellersContainer}
            />
          )}
        </View>

        {/* Expenses Section */}
        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            {expenseList.length > 0 && (
              <Text style={styles.expenseCount}>
                {safeTripData.length} expense
                {safeTripData.length !== 1 ? "s" : ""}
              </Text>
            )}
          </View>

          {expenseList.length > 0 ? (
            <View style={styles.expensesList}>
              {expenseList.map((item, index) => (
                <View key={item.id}>
                  {renderItem({
                    item,
                    index,
                    handleLongPress,
                    handleItemPress,
                  })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons
                  name="receipt-outline"
                  size={64}
                  color={COLOR.grey + "60"}
                />
              </View>
              <Text style={styles.emptyStateTitle}>No expenses yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your trip expenses by tapping the + button below
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleModal}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLOR.actionText || "#fff"} />
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <TrackOnTripModal
        itemIdToUpdate={itemIdToUpdate}
        modalVisible={modalVisible}
        onclose={toggleModal}
        handleDataChange={handleExpenseDataChange}
        expenseDataOnTrip={expenseDataOnTrip}
        onSubmit={onSubmit}
        traveller={safeTravellerNames}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  scrollView: {
    flex: 1,
  },

  // Header Section
  headerSection: {
    backgroundColor: "#fff",
    paddingBottom: 20,
    marginBottom: 8,
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  progressPercentage: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBar: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
    minWidth: 2,
  },
  overBudgetBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: COLOR.danger + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overBudgetText: {
    marginLeft: 4,
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: COLOR.danger,
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  summaryIconContainer: {
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    marginBottom: 4,
    textAlign: "center",
  },
  summaryValue: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    textAlign: "center",
  },

  // Travellers Section (Sticky)
  travellersSection: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1,
  },
  travellersHeader: {
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    lineHeight: 16,
  },
  travellersContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  travellerLoader: {
    marginLeft: 20,
  },

  // Expenses Section
  expensesContainer: {
    backgroundColor: "#fff",
    paddingBottom: 120,
  },
  expensesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  expenseCount: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 80,
  },
  emptyStateIcon: {
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    lineHeight: 22,
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLOR.actionButton || COLOR.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLOR.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default TrackOnTrip;
