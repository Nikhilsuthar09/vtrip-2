import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { faqData, guideSteps } from "../constants/helpSupportData";
import { useAuth } from "../Context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../Configs/firebaseConfig";

const HelpSupport = () => {
  const [expanded, setExpanded] = useState(null);
  const [feedbackModalVisible, setFeedbackModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [loading, setloading] = useState(false);
  const { uid } = useAuth();

  const toggleExpand = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  const handleEmailSupport = () => {
    Linking.openURL(
      "mailto:getvtriphelp@gmail.com?subject=Help%20with%20Vtrip"
    );
  };

  const handleFeedbackPress = () => {
    setFeedbackModalVisible(true);
  };

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) {
      Alert.alert("Error", "Please enter your feedback before sending.");
      return;
    }

    // add feedback
    setloading(true);
    try {
      const docRef = collection(db, "feedback");
      const docitems = {
        uid,
        feedback: feedbackText.trim(),
        createdAt: serverTimestamp(),
      };
      await addDoc(docRef, docitems);
      Alert.alert("Thank you for your feedback!");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Something went wrong, Please try again later");
    } finally {
      setloading(false);
    }

    // Close modal and reset
    setFeedbackModalVisible(false);
    setFeedbackText("");
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalVisible(false);
    setFeedbackText("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <Text style={styles.headerSubtitle}>
          We're here to help you make the most of Vtrip
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={handleEmailSupport}
        >
          <MaterialCommunityIcons
            name="email-outline"
            size={20}
            color={COLOR.primary}
          />
          <Text style={styles.quickActionText}>Contact Us</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={handleFeedbackPress}
        >
          <MaterialIcons name="feedback" size={20} color={COLOR.primary} />
          <Text style={styles.quickActionText}>Send Feedback</Text>
        </TouchableOpacity>
      </View>

      {/* FAQs Section */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => toggleExpand("faq")}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconTitleContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="frequently-asked-questions"
                size={22}
                color={COLOR.primary}
              />
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.cardTitle}>FAQ</Text>
              <Text style={styles.cardSubtitle}>
                Quick answers to common questions
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={expanded === "faq" ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLOR.textSecondary}
          />
        </View>

        {expanded === "faq" && (
          <View style={styles.expandedContent}>
            {faqData.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>Q: {faq.question}</Text>
                <Text style={styles.faqAnswer}>A: {faq.answer}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* App Guide Section */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => toggleExpand("guide")}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconTitleContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="map-outline"
                size={22}
                color={COLOR.primary}
              />
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.cardTitle}>Getting Started Guide</Text>
              <Text style={styles.cardSubtitle}>Step-by-step walkthrough</Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name={expanded === "guide" ? "chevron-up" : "chevron-down"}
            size={24}
            color={COLOR.textSecondary}
          />
        </View>

        {expanded === "guide" && (
          <View style={styles.expandedContent}>
            {guideSteps.map((step, index) => (
              <View key={index} style={styles.guideStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Thank you for using Vtrip! We're constantly working to improve your
          travel planning experience.
        </Text>
      </View>

      {/* Feedback Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={feedbackModalVisible}
        onRequestClose={handleCloseFeedbackModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Feedback</Text>
              <TouchableOpacity
                onPress={handleCloseFeedbackModal}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLOR.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                We'd love to hear your thoughts! Share your feedback to help us
                improve Vtrip.
              </Text>

              <TextInput
                style={styles.textArea}
                placeholder="Type your feedback here..."
                placeholderTextColor={COLOR.textSecondary}
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
              />

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseFeedbackModal}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                {loading ? (
                  <ActivityIndicator size={"large"} color={COLOR.primary} />
                ) : (
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendFeedback}
                  >
                    <MaterialIcons name="send" size={18} color="#fff" />
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: FONT_SIZE.h2,
    fontFamily: FONTS.bold,
    color: COLOR.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    lineHeight: 20,
  },
  quickActionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 15,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLOR.stroke,
  },
  quickActionText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.primary,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  iconTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLOR.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardTitle: {
    fontSize: FONT_SIZE.h4,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: FONT_SIZE.small,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
  },
  expandedContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLOR.border || "#E5E7EB",
  },
  faqItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  faqQuestion: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 8,
    lineHeight: 20,
  },
  faqAnswer: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    lineHeight: 20,
  },
  guideStep: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  stepNumberText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.bold,
    color: "#fff",
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepTitle: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    paddingTop: 10,
  },
  footerText: {
    fontSize: FONT_SIZE.small,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: FONT_SIZE.h3,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLOR.stroke || "#E5E7EB",
    borderRadius: 12,
    padding: 15,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.regular,
    color: COLOR.textPrimary,
    height: 120,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.stroke || "#E5E7EB",
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: COLOR.textSecondary,
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sendButtonText: {
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
    color: "#fff",
    marginLeft: 6,
  },
});

export default HelpSupport;
