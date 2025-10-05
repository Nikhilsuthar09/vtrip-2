import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import {
  useOnTripExpenseOnce,
  usePlannedExpenseOnce,
} from "../../utils/firebaseTripHandler";
import Spinner from "../../components/Spinner";
import { PieChart, BarChart } from "react-native-chart-kit";
import { useTravellerNames } from "../../utils/firebaseTravellerHandler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");
const chartWidth = screenWidth - 60;

const Expenses = ({ route }) => {
  const { id, budget } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const { travellerNames, travellerLoading, travellerError } =
    useTravellerNames(id);
  const navigation = useNavigation();
  const safeTravellerNames = travellerNames || []

  // Fetch data for both planned and on-trip expenses
  const {
    plannedExpenseData,
    loading: plannedExpenseLoading,
    refetch: refetchPlanned,
  } = usePlannedExpenseOnce(id);

  const {
    onTripExpenseData,
    loading: onTripLoading,
    refetch: refetchOnTrip,
  } = useOnTripExpenseOnce(id);

  const safePlannedExpenseData = plannedExpenseData || [];
  const safeOnTripExpenseData = onTripExpenseData || [];

  // Refresh function for pull-to-refresh
  const onRefresh = useCallback(async () => {
    await Promise.all([refetchPlanned(), refetchOnTrip()]);
  }, [refetchPlanned, refetchOnTrip]);

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  if (plannedExpenseLoading || onTripLoading) return <Spinner />;

  const handlePlanInAdv = () => {
    navigation.navigate("PlanExpenseInAdvance", {
      id: id,
      budget: budget,
    });
  };

  const trackOnTrip = () => {
    navigation.navigate("TrackOnTrip", {
      id: id,
      budget: budget,
      safeTravellerNames,
      travellerLoading,
    });
  };

  // Calculate planned expenses data
  const totalPlanned = safePlannedExpenseData.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  const plannedRemaining = Math.max(budget - totalPlanned, 0);
  const hasPlannedExpenses = safePlannedExpenseData.length > 0;

  // Calculate on-trip expenses data
  const totalOnTripSpent = safeOnTripExpenseData.reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);
  const onTripRemaining = Math.max(budget - totalOnTripSpent, 0);
  const hasOnTripExpenses = safeOnTripExpenseData.length > 0;

  // Group on-trip expenses by traveller for bar chart
  const expensesByTraveller = safeOnTripExpenseData.reduce((acc, expense) => {
    const traveller = expense.paidBy;
    acc[traveller] = (acc[traveller] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  //  Pie Chart Component
  const EnhancedPieChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Budget Planning</Text>
        <Text style={styles.chartSubtitle}>
          {safePlannedExpenseData.length} planned expense
          {safePlannedExpenseData.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <View style={styles.pieChartWrapper}>
        <PieChart
          data={[
            {
              name: "Planned",
              amount: totalPlanned,
              color: COLOR.primary,
              legendFontColor: COLOR.textPrimary,
              legendFontSize: 12,
            },
            {
              name: "Remaining",
              amount: plannedRemaining,
              color: "#4CAF50",
              legendFontColor: COLOR.textPrimary,
              legendFontSize: 12,
            },
          ]}
          width={chartWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            strokeWidth: 2,
            barPercentage: 0.7,
            useShadowColorFromDataset: false,
            decimalPlaces: 0,
            labelColor: () => COLOR.grey,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 12,
              fontFamily: FONTS.medium,
            },
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[10, 0]}
          hasLegend={true}
        />
      </View>

      <View style={styles.pieChartStats}>
        <View style={styles.statCard}>
          <Text style={styles.statCardValue}>
            ₹{totalPlanned.toLocaleString("en-IN")}
          </Text>
          <Text style={styles.statCardLabel}>Total Planned</Text>
        </View>
        <View style={styles.statCard}>
          <Text
            style={[
              styles.statCardValue,
              { color: COLOR.success || "#4CAF50" },
            ]}
          >
            ₹{plannedRemaining.toLocaleString("en-IN")}
          </Text>
          <Text style={styles.statCardLabel}>Remaining</Text>
        </View>
      </View>
    </View>
  );

  // Enhanced Bar Chart Component with Dynamic Y-axis Scaling
  const EnhancedBarChart = () => {
    const travellerEntries = Object.entries(expensesByTraveller);

    if (travellerEntries.length === 0) {
      return null;
    }

    // Calculate the maximum expense amount to determine scaling
    const maxExpenseAmount = Math.max(
      ...travellerEntries.map(([, amount]) => amount),
      0
    );

    // Determine appropriate scaling and suffix based on max amount
    let scaleFactor = 1;
    let suffix = "";
    let yAxisLabel = "₹";
    let decimalPlaces = 0;

    if (maxExpenseAmount >= 100000) {
      // >= 1 lakh
      scaleFactor = 100000;
      suffix = "L";
      decimalPlaces = 1;
    } else if (maxExpenseAmount >= 1000) {
      // >= 1k
      scaleFactor = 1000;
      suffix = "k";
      decimalPlaces = 1;
    } else {
      // < 1k
      scaleFactor = 1;
      suffix = "";
      decimalPlaces = 0;
    }

    // Calculate dynamic segments
    const maxScaledValue = maxExpenseAmount / scaleFactor;
    const paddedMax = Math.ceil(maxScaledValue * 1.2); // Add 20% padding

    // Ensure we have meaningful segments
    let segments = 4; // Default to 4 segments for better chart appearance
    if (paddedMax <= 5) {
      segments = Math.max(paddedMax, 2);
    }

    // Calculate dynamic chart width based on number of travellers
    const minBarWidth = 80; // Minimum width per bar
    const padding = 40; // Chart padding
    const calculatedWidth = Math.max(
      chartWidth,
      travellerEntries.length * minBarWidth + padding
    );

    const barChartData = {
      labels: travellerEntries.map(([traveller]) =>
        traveller.length > 8 ? traveller.substring(0, 6) + ".." : traveller
      ),
      datasets: [
        {
          data: travellerEntries.map(([, amount]) => {
            const scaledValue = amount / scaleFactor;
            return Number(scaledValue.toFixed(decimalPlaces));
          }),
          colors: travellerEntries.map((_, index) => {
            const colors = [
              () => COLOR.primary,
              () => "#4CAF50",
              () => "#FF9800",
              () => COLOR.danger,
              () => "#2196F3",
              () => "#9C27B0",
              () => "#607D8B",
              () => "#FF5722",
              () => "#795548",
              () => "#009688",
            ];
            return colors[index % colors.length];
          }),
        },
      ],
    };

    const chartConfig = {
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
      strokeWidth: 2,
      barPercentage: 0.7, // Increased from 0.6 to make bars wider
      fillShadowGradient: COLOR.primary,
      fillShadowGradientOpacity: 0.8,
      decimalPlaces: decimalPlaces,
      labelColor: () => COLOR.grey,
      style: {
        borderRadius: 16,
      },
      propsForLabels: {
        fontSize: 10,
        fontFamily: FONTS.medium,
      },
      formatYLabel: (value) => `${yAxisLabel}${value}${suffix}`,
    };

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Expense Breakdown</Text>
          <Text style={styles.chartSubtitle}>
            {safeOnTripExpenseData.length} transaction
            {safeOnTripExpenseData.length !== 1 ? "s" : ""} by{" "}
            {travellerEntries.length} traveller
            {travellerEntries.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {/* Horizontal ScrollView for the chart */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.chartScrollContent}
          style={styles.chartScrollView}
        >
          <BarChart
            data={barChartData}
            width={calculatedWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.barChart}
            yAxisSuffix={suffix}
            fromZero={true}
            showValuesOnTopOfBars={true}
            flatColor={true}
            withCustomBarColorFromData={true}
            withInnerLines={true}
            segments={segments}
            verticalLabelRotation={0}
          />
        </ScrollView>

        {/* Show scroll hint if there are many travellers */}
        {travellerEntries.length > 3 && (
          <View style={styles.scrollHint}>
            <Text style={styles.scrollHintText}>
              ← Scroll to see all {travellerEntries.length} travellers →
            </Text>
          </View>
        )}

        <View style={styles.barChartStats}>
          <View style={styles.statRow}>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>
                ₹{totalOnTripSpent.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.miniStatLabel}>Total Spent</Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text
                style={[
                  styles.miniStatValue,
                  {
                    color:
                      onTripRemaining > 0
                        ? COLOR.success || "#4CAF50"
                        : COLOR.danger,
                  },
                ]}
              >
                ₹{onTripRemaining.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.miniStatLabel}>Budget Left</Text>
            </View>
            <View style={styles.miniStatCard}>
              <Text style={styles.miniStatValue}>
                {Object.keys(expensesByTraveller).length}
              </Text>
              <Text style={styles.miniStatLabel}>Travellers</Text>
            </View>
          </View>

          {/* Scale indicator */}
          {scaleFactor !== 1 && (
            <View style={styles.scaleIndicator}>
              <Text style={styles.scaleText}>
                Scale:{" "}
                {scaleFactor === 100000 ? "1L = ₹1,00,000" : "1k = ₹1,000"}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // Placeholder Component
  const PlaceholderBox = ({ title, subtitle, icon, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.dashedBox}>
      <Ionicons name={icon} size={32} color={COLOR.primary} />
      <Text style={styles.boxTitle}>{title}</Text>
      <Text style={styles.boxSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={{flex:1}}>
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[COLOR.primary]}
          tintColor={COLOR.primary}
        />
      }
    >
      <Text style={styles.instruction}>Track your travel expenses</Text>

      {/* Plan in Advance Section */}
      <View
        style={[styles.section, hasPlannedExpenses && styles.sectionWithChart]}
      >
        {hasPlannedExpenses ? (
          <EnhancedPieChart />
        ) : (
          <PlaceholderBox
            title="Plan in Advance"
            subtitle="Set budgets for hotels, food, and transport before your trip starts."
            icon="add-circle-outline"
            onPress={handlePlanInAdv}
          />
        )}

        {hasPlannedExpenses && (
          <TouchableOpacity
            onPress={handlePlanInAdv}
            activeOpacity={0.8}
            style={styles.chartOverlay}
          >
            <Ionicons name="trending-up-outline" size={20} color="#fff" />
            <Text style={styles.overlayText}>
              Tap to manage planned expenses
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Track During Trip Section */}
      <View
        style={[styles.section, hasOnTripExpenses && styles.sectionWithChart]}
      >
        {hasOnTripExpenses ? (
          <EnhancedBarChart />
        ) : (
          <PlaceholderBox
            title="Track During Trip"
            subtitle="Log your expenses in real-time to stay on budget."
            icon="add-circle-outline"
            onPress={trackOnTrip}
          />
        )}

        {hasOnTripExpenses && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={trackOnTrip}
            style={styles.chartOverlay}
          >
            <Ionicons name="bar-chart-outline" size={20} color="#fff" />
            <Text style={styles.overlayText}>Tap to add or view expenses</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },
  instruction: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.medium,
    color: COLOR.grey,
    textAlign: "center",
    marginVertical: 24,
  },

  // Section Styles
  section: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  sectionWithChart: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    paddingBottom: 30,
  },

  // Placeholder Styles
  dashedBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLOR.primary,
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    backgroundColor: COLOR.primary + "08",
    margin: 4,
  },
  boxTitle: {
    fontSize: FONT_SIZE.H5,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  boxSubtitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
    lineHeight: 20,
  },

  // Chart Container Styles
  chartContainer: {
    padding: 20,
  },
  chartHeader: {
    marginBottom: 16,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
  },

  // Pie Chart Styles
  pieChartWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  pieChartStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.grey + "20",
  },

  // Bar Chart Styles
  barChart: {
    borderRadius: 16,
    marginLeft: 8,
  },
  barChartStats: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.grey + "20",
  },

  // Chart Overlay
  chartOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.primary + "E6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    marginLeft: 8,
  },

  // Stats Card Styles
  statCard: {
    width: "48%",
    backgroundColor: COLOR.primary + "08",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLOR.primary + "20",
  },
  statCardValue: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  statCardLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
  },

  // Mini Stats
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  miniStatCard: {
    alignItems: "center",
    flex: 1,
  },
  miniStatValue: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  miniStatLabel: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    textAlign: "center",
  },

  // Scale Indicator Styles
  scaleIndicator: {
    marginTop: 8,
    alignItems: "center",
  },
  scaleText: {
    fontSize: FONT_SIZE.caption - 1,
    fontFamily: FONTS.regular,
    color: COLOR.grey,
    fontStyle: "italic",
  },
  barChart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartScrollView: {
    marginBottom: 8,
  },
  chartScrollContent: {
    paddingHorizontal: 10,
  },
  scrollHint: {
    backgroundColor: COLOR.primary + "10",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "center",
    marginBottom: 12,
  },
  scrollHintText: {
    fontSize: FONT_SIZE.caption - 1,
    fontFamily: FONTS.regular,
    color: COLOR.primary,
    textAlign: "center",
  },
  barChartStats: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLOR.grey + "20",
  },
});

export default Expenses;
