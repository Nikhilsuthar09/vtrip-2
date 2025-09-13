import { useState } from "react";
import HomeScreen from "../Screens/HomeScreen";
import MyTrip from "../Screens/MyTrip";
import AddTripModal from "../components/AddTripModal";
import CreateTripButton from "../components/CreateTripButton";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

const Tab = createBottomTabNavigator();

function EmptyComponent() {
  return null;
}
export default function HomeTabs() {
  const [isModalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          animation: "shift",
          tabBarStyle: {
            height: 60 + (Platform.OS === "android" ? insets.bottom : 0),
            paddingBottom: Platform.OS === "android" ? insets.bottom : 0,
            paddingTop: 2,
          },
          tabBarActiveTintColor: COLOR.primary,
          tabBarInactiveTintColor: COLOR.grey,
          tabBarLabelStyle: {
            fontFamily: FONTS.medium,
            fontSize: FONT_SIZE.caption,
          },
          tabBarPressColor: "transparent",
        }}
      >
        <Tab.Screen
          name="Home"
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={20} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.selectionAsync();
            },
          }}
        >
          {(props) => <HomeScreen {...props} onPress={openModal} />}
        </Tab.Screen>
        <Tab.Screen
          name="Center"
          component={EmptyComponent}
          options={{
            tabBarButton: (props) => (
              <CreateTripButton {...props} onPress={openModal}>
                <Ionicons name="add" size={28} color={COLOR.actionText} />
              </CreateTripButton>
            ),
          }}
        />
        <Tab.Screen
          name="My Trips"
          component={MyTrip}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Ionicons name="airplane" size={20} color={color} />
            ),
          }}
          listeners={{
            tabPress: () => {
              Haptics.selectionAsync();
            },
          }}
        />
      </Tab.Navigator>
      <AddTripModal
        isModalVisible={isModalVisible}
        onClose={closeModal}
        onBackButtonPressed={closeModal}
      />
    </>
  );
}
