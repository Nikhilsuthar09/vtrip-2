import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Animated,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import Checkbox from "expo-checkbox";
import { useRef, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const PackingListCard = ({
  title,
  data,
  toggleChecked,
  isChecked,
  openModal,
  isLast,
  handleAddByCategory,
}) => {
  const pressableRefs = useRef({});
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  const checkedCount = data.filter((item) => item.isPacked).length;
  const completionPercentage = data.length > 0 ? (checkedCount / data.length) * 100 : 0;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getCompletionColor = () => {
    if (completionPercentage === 100) return "#4caf50";
    if (completionPercentage >= 75) return "#ff9800";
    if (completionPercentage >= 50) return "#2196f3";
    return "#9e9e9e";
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        isLast && { marginBottom: 100 },
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/*  Category Header */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryInfo}>
          <View style={styles.categoryTitleRow}>
            <Text style={styles.categorylabel}>{title}</Text>
            <View style={[styles.completionBadge, { backgroundColor: getCompletionColor() }]}>
              <Text style={styles.completionText}>
                {Math.round(completionPercentage)}%
              </Text>
            </View>
          </View>
          <View style={styles.categoryStats}>
            <Text style={styles.checkedCount}>
              {checkedCount} of {data.length} packed
            </Text>
            {completionPercentage === 100 && (
              <View style={styles.completedIcon}>
                <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => handleAddByCategory(title)}
          style={styles.addButton}
        >
          <Ionicons name="add-circle-outline" color={COLOR.primary} size={24} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar for Category */}
      <View style={styles.categoryProgressContainer}>
        <View style={styles.categoryProgressTrack}>
          <Animated.View 
            style={[
              styles.categoryProgressFill,
              { 
                width: `${completionPercentage}%`,
                backgroundColor: getCompletionColor(),
              }
            ]}
          />
        </View>
      </View>

      {/* Items List */}
      <View style={styles.itemsList}>
        {data
          .sort((a, b) => {
            // Sort by packed status first, then alphabetically
            if (a.isPacked !== b.isPacked) {
              return a.isPacked ? 1 : -1;
            }
            return a.item.localeCompare(b.item);
          })
          .map((item, index) => {
            const hasNote = item.note?.trim() !== "";
            const isItemChecked = item.isPacked || isChecked[item.id] || false;
            
            return (
              <Pressable
                ref={(ref) => {
                  pressableRefs.current[item.id] = ref;
                }}
                onPress={() => !item.isPacked && toggleChecked(item.id)}
                onLongPress={(e) => openModal(item.id, e)}
                key={item.id}
                style={[
                  styles.itemListContainer,
                  isItemChecked && styles.itemChecked,
                  item.isPacked && styles.itemPacked,
                ]}
              >
                <View style={styles.itemContent}>
                  <View style={styles.itemMainRow}>
                    <View style={styles.itemLeft}>
                      <Checkbox
                        disabled={item.isPacked}
                        style={[
                          styles.checkbox,
                          isItemChecked && styles.checkboxChecked,
                        ]}
                        onValueChange={() => toggleChecked(item.id)}
                        value={isItemChecked}
                        color={isItemChecked ? COLOR.primary : undefined}
                      />
                      <View style={styles.itemDetails}>
                        <Text
                          style={[
                            styles.itemText,
                            item.isPacked && styles.strikethrough,
                          ]}
                        >
                          {item.item}
                        </Text>
                        {hasNote && (
                          <Text style={[styles.note, item.isPacked && styles.strikethrough]}>
                            {item.note}
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.itemRight}>
                      <View style={styles.quantityContainer}>
                        <Text
                          style={[
                            styles.quantity,
                            item.isPacked && styles.strikethrough,
                          ]}
                        >
                          ×{item.quantity}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={(e) => openModal(item.id, e)}
                        style={styles.menuButton}
                      >
                        <Entypo
                          name="dots-three-vertical"
                          size={16}
                          color={COLOR.grey}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {item.isPacked && (
                    <View style={styles.packedIndicator}>
                      <Ionicons name="checkmark-done" size={14} color="#4caf50" />
                      <Text style={styles.packedText}>Packed</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingBottom: 12,
    backgroundColor: "#fafafa",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  categorylabel: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.title,
    color: "#2c3e50",
    marginRight: 12,
  },
  completionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    minWidth: 45,
    alignItems: "center",
  },
  completionText: {
    color: "#fff",
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.semiBold,
  },
  categoryStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkedCount: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.caption,
    color: "#6c757d",
  },
  completedIcon: {
    marginLeft: 8,
  },
  addButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(33, 150, 243, 0.1)",
  },
  categoryProgressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fafafa",
  },
  categoryProgressTrack: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  itemsList: {
    padding: 12,
  },
  itemListContainer: {
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    transition: "all 0.2s ease",
  },
  itemChecked: {
    backgroundColor: "rgba(33, 150, 243, 0.05)",
    borderColor: COLOR.primary,
    borderWidth: 1,
  },
  itemPacked: {
    backgroundColor: "rgba(76, 175, 80, 0.05)",
    borderColor: "#4caf50",
  },
  itemContent: {
    gap: 8,
  },
  itemMainRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    marginRight: 14,
    borderRadius: 6,
    marginTop: 2,
  },
  checkboxChecked: {
    transform: [{ scale: 1.1 }],
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#2c3e50",
    lineHeight: 22,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption,
    color: "#6c757d",
    marginTop: 4,
    fontStyle: "italic",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityContainer: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 35,
    alignItems: "center",
  },
  quantity: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.caption,
    color: "#495057",
  },
  menuButton: {
    padding: 4,
  },
  packedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  packedText: {
    fontSize: FONT_SIZE.caption,
    fontFamily: FONTS.medium,
    color: "#4caf50",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    color: COLOR.grey,
    opacity: 0.6,
  },
});

export default PackingListCard;