import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";

const CreateNewCategory = ({ 
  isNewCategoryModalVisible, 
  onCloseModal, 
  input, 
  setInput, 
  onAdd 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isNewCategoryModalVisible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isNewCategoryModalVisible]);

  return (
    <Modal
      visible={isNewCategoryModalVisible}
      animationType="none"
      onRequestClose={onCloseModal}
      transparent
    >
      <TouchableWithoutFeedback onPress={onCloseModal}>
        <Animated.View 
          style={[
            styles.modalOverlay,
            { opacity: opacityAnim }
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: opacityAnim,
                }
              ]}
            >
              {/* Header with icon and title */}
              <View style={styles.modalHeader}>
                <View style={styles.headerContent}>
                  <View style={styles.iconContainer}>
                    <Ionicons 
                      name="add-circle" 
                      size={24} 
                      color={COLOR.primary} 
                    />
                  </View>
                  <Text style={styles.modalTitle}>New Category</Text>
                </View>
                <Pressable 
                  style={styles.closeButton}
                  onPress={onCloseModal}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <AntDesign
                    name="close"
                    size={20}
                    color={COLOR.textSecondary}
                  />
                </Pressable>
              </View>

              {/* Input Section */}
              <View style={styles.inputSection}>
                <Text style={styles.label}>Category Name</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    placeholder="e.g., Snacks, Toiletries, Documents"
                    placeholderTextColor={COLOR.placeholder}
                    style={styles.textInput}
                    onChangeText={setInput}
                    value={input}
                    autoFocus={true}
                    maxLength={20}
                  />
                  {input.length > 0 && (
                    <Pressable 
                      style={styles.clearButton}
                      onPress={() => setInput("")}
                    >
                      <AntDesign 
                        name="closecircle" 
                        size={16} 
                        color={COLOR.textSecondary} 
                      />
                    </Pressable>
                  )}
                </View>
                <Text style={styles.charCounter}>
                  {input.length}/20 characters
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.buttonSection}>
                <Pressable 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={onCloseModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable 
                  style={[
                    styles.button, 
                    styles.addButton,
                    !input.trim() && styles.disabledButton
                  ]} 
                  onPress={onAdd}
                  disabled={!input.trim()}
                >
                  <Text style={[
                    styles.addButtonText,
                    !input.trim() && styles.disabledButtonText
                  ]}>
                    Create
                  </Text>
                </Pressable>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    maxWidth: 350,
    borderRadius: 20,
    padding: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLOR.primaryLight || '#E3F2FD',
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.H6 || 18,
    color: COLOR.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.backgroundSecondary || '#F5F5F5',
    justifyContent: "center",
    alignItems: "center",
  },
  inputSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLOR.stroke || '#E0E0E0',
    borderRadius: 12,
    backgroundColor: COLOR.backgroundSecondary || '#FAFAFA',
  },
  textInput: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.body,
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: COLOR.textPrimary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  charCounter: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.caption || 12,
    color: COLOR.textSecondary,
    textAlign: "right",
    marginTop: 4,
  },
  buttonSection: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: COLOR.backgroundSecondary || '#F5F5F5',
    borderWidth: 1,
    borderColor: COLOR.stroke || '#E0E0E0',
  },
  cancelButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZE.body,
    color: COLOR.textSecondary,
  },
  addButton: {
    backgroundColor: COLOR.primary,
  },
  addButtonText: {
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.body,
    color: "#fff",
  },
  disabledButton: {
    backgroundColor: COLOR.stroke || '#E0E0E0',
  },
  disabledButtonText: {
    color: COLOR.textSecondary,
  },
});

export default CreateNewCategory;