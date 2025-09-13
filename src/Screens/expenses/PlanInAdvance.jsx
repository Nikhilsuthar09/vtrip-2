import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { FONTS, FONT_SIZE, COLOR } from "../../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import PlanInAdvanceModal from "../../components/expense/PlanInAdvanceModal";
import Spinner from "../../components/Spinner";
import { usePlannedExpense } from "../../utils/firebaseTripHandler";
import ErrorScreen from "../../components/ErrorScreen";
import { deleteExpense } from "../../utils/firebase_crud/expenses/expenseCrud";
import { getExpenseColor } from "../../utils/expenses/getExpenseColor";
import { SafeAreaView } from "react-native-safe-area-context";

const PlanInAdvance = ({ route }) => {
  const { id, budget } = route.params;
  const tripId = id || "";
  const { plannedExpenseData, loading, error } = usePlannedExpense(id);
  const safePlannedExpenseData = plannedExpenseData || [];
  const [isVisible, setIsVisible] = useState(false);
  const [updateItem, setUpdateItem] = useState(null);

  if (loading) return <Spinner />;
  if (error) return <ErrorScreen />;

  const totalExpenses = safePlannedExpenseData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const budgetPercentage = Math.min((totalExpenses / budget) * 100, 100);
  const remaining = budget - totalExpenses;
  const isOverBudget = remaining < 0;

  const toggleModal = () => {
    if (isVisible) {
      setUpdateItem(null);
    }
    setIsVisible(!isVisible);
  };

  const handleDeletePress = (itemId, categoryName) => {
    Alert.alert(
      "Delete Expense",
      `Are you sure you want to delete "${categoryName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteExpense(tripId, itemId, "plannedExpenses");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const updateExpense = async (editDocId) => {
    const itemToEdit = safePlannedExpenseData.find(
      (item) => item.id === editDocId
    );
    if (itemToEdit) {
      setUpdateItem(itemToEdit);
      toggleModal();
    }
  };

  const renderExpenseItem = ({ item, index }) => {
    const categoryColor = getExpenseColor(item.expenseType);

    return (
      <TouchableOpacity
        onPress={() => updateExpense(item.id)}
        style={[styles.expenseItem, index === 0 && styles.firstItem]}
        activeOpacity={0.7}
      >
        {/* Left colored indicator */}
        <View
          style={[styles.expenseIndicator, { backgroundColor: categoryColor }]}
        />

        {/* Main content */}
        <View style={styles.expenseContent}>
          <View style={styles.expenseHeader}>
            <Text style={styles.expenseCategory} numberOfLines={1}>
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
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => updateExpense(item.id)}
          >
            <Ionicons name="create-outline" size={20} color={COLOR.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePress(item.id, item.expenseType)}
          >
            <Ionicons name="trash-outline" size={20} color={COLOR.danger} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Header Section */}
        <View style={styles.headerSection}>
          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Budget Planning</Text>
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

          {/* Enhanced Summary Cards */}
          <View style={styles.summaryContainer}>
            <View style={[styles.summaryCard, styles.plannedCard]}>
              <View style={styles.summaryIconContainer}>
                <Ionicons
                  name="clipboard-outline"
                  size={24}
                  color={COLOR.primary}
                />
              </View>
              <Text style={styles.summaryLabel}>Total Planned</Text>
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
                ₹{budget?.toLocaleString("en-IN")}
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

          {/* Planning Tip */}
          <View style={styles.tipContainer}>
            <View style={styles.tipIcon}>
              <Ionicons name="bulb-outline" size={20} color={COLOR.primary} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Planning Tip</Text>
              <Text style={styles.tipText}>
                Add all your expected expenses to get a better overview of your
                trip budget
              </Text>
            </View>
          </View>
        </View>

        {/* Enhanced Expenses Section */}
        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={styles.sectionTitle}>Planned Expenses</Text>
            {safePlannedExpenseData.length > 0 && (
              <Text style={styles.expenseCount}>
                {safePlannedExpenseData.length} item
                {safePlannedExpenseData.length !== 1 ? "s" : ""}
              </Text>
            )}
          </View>

          {safePlannedExpenseData.length > 0 ? (
            <View style={styles.expensesList}>
              {safePlannedExpenseData.map((item, index) => (
                <View key={item.id}>{renderExpenseItem({ item, index })}</View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Ionicons
                  name="clipboard-outline"
                  size={64}
                  color={COLOR.grey + "60"}
                />
              </View>
              <Text style={styles.emptyStateTitle}>
                No expenses planned yet
              </Text>
              <Text style={styles.emptyStateSubtext}>
                Start planning your trip by adding expected expenses below
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Enhanced Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={toggleModal}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color={COLOR.actionText || "#fff"} />
      </TouchableOpacity>

      {/* Modal */}
      <PlanInAdvanceModal
        tripId={tripId}
        isVisible={isVisible}
        onClose={toggleModal}
        onBackButtonPress={toggleModal}
        itemToUpdate={updateItem}
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
    minWidth: 4,
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
    marginBottom: 16,
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

  // Tip Container
  tipContainer: {
    flexDirection: "row",
    backgroundColor: COLOR.primary + "10",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLOR.primary,
  },
  tipIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  tipText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    lineHeight: 18,
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
  sectionTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  expenseCount: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },

  // Expense Items
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
  expenseCategory: {
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
  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    marginRight: 8,
    gap: 8,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.primary + "10",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLOR.danger + "10",
    justifyContent: "center",
    alignItems: "center",
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

export default PlanInAdvance;
