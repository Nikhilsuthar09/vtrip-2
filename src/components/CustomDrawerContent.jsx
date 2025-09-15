import { signOut } from "firebase/auth";
import { auth } from "../Configs/firebaseConfig";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../Context/AuthContext";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import DeleteUserModal from "./profile/DeleteUserModal";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  getTitleCase,
  getuserNameChars,
} from "../utils/common/processUserData";

export default function CustomDrawerContent(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const { name, email, user, imageUrl } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
            if (user?.providerData[0].providerId === "google.com") {
              await GoogleSignin.signOut();
            }
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete accout",
      "Are you sure you want to delete your account?\n\nThis action cannot be undone and all your data will be permanently lost.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm delete",
          style: "destructive",
          onPress: async () => {
            setModalVisible(true);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.profileText}>{getuserNameChars(name)}</Text>
            )}
          </View>
          <Text style={styles.userName}>{getTitleCase(name)}</Text>
          <Text style={styles.userSubtext}>{email}</Text>
        </View>

        {/* Drawer Items */}
        <View style={styles.drawerItems}>
          {/* You can add more drawer items here */}
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() =>
              navigation.navigate("MainDrawer", {
                screen: "MainApp",
                params: { screen: "profile" },
              })
            }
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={COLOR.textPrimary}
            />
            <Text style={styles.drawerItemText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons
              name="help-circle-outline"
              size={20}
              color={COLOR.textPrimary}
            />
            <Text style={styles.drawerItemText}>Help & Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleDeleteAccount}
            style={styles.drawerItem}
          >
            <AntDesign name="user-delete" size={20} color={COLOR.danger} />
            <Text style={[styles.drawerItemText, { color: COLOR.danger }]}>
              Delete account
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>

      {/* Logout Button at Bottom */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <DeleteUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  profileContainer: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: COLOR.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth:2,
    borderColor:COLOR.primary
  },
  profileText: {
    color: "#fff",
    fontFamily: FONTS.semiBold,
    fontSize: FONT_SIZE.H6,
  },
  userName: {
    fontSize: FONT_SIZE.H6,
    fontFamily: FONTS.semiBold,
    color: COLOR.textPrimary,
    marginBottom: 4,
  },
  userSubtext: {
    fontSize: FONT_SIZE.body,
    color: COLOR.grey,
    textAlign: "center",
  },
  drawerItems: {
    flex: 1,
    paddingTop: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f0f0f0",
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.medium,
    color: COLOR.textPrimary,
  },
  bottomSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLOR.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  logoutText: {
    marginLeft: 8,
    color: "#fff",
    fontSize: FONT_SIZE.body,
    fontFamily: FONTS.semiBold,
  },
});
