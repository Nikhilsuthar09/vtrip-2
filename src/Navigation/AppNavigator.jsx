import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Signup from "../Screens/Signup";
import AuthScreen from "../Screens/AuthScreen";
import { useAuth } from "../Context/AuthContext";
import Spinner from "../components/Spinner";
import TopTabs from "./TopTabNavigator";
import HomeTabs from "./BottomTabNavigator";
import PlanInAdvance from "../Screens/expenses/PlanInAdvance";
import TrackOnTrip from "../Screens/expenses/TrackOnTrip";
import ItineraryList from "../Screens/itinerary/ItineraryList";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import { Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../utils/calendar/handleCurrentDate";
import Entypo from "@expo/vector-icons/Entypo";
import CustomDrawerContent from "../components/CustomDrawerContent";
import InviteCollaborators from "../Screens/InviteCollaborators";
import NotificationsScreen from "../Screens/Notification";
import Profile from "../Screens/Profile";
import TravellersScreen from "../Screens/TravellersScreen";
import { useState } from "react";
import TopTabMenuModal from "../components/TopTabMenuModal";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export function MainStackNavigator() {
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [currentTripData, setCurrentTripData] = useState(null);
  const navigation = useNavigation();

  const handleMenuPress = (tripData, nav) => {
    console.log(tripData);
    setCurrentTripData({ ...tripData, navigation: nav });
    setMenuModalVisible(true);
  };

  return (
    <>
      <Stack.Navigator screenOptions={{ animation: "fade" }}>
        <Stack.Screen
          name="BottomTabs"
          component={HomeTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TopTabs"
          component={TopTabs}
          options={({ route, navigation }) => ({
            headerTitle: () => {
              const title = route?.params?.destination;
              const subtitle = `${formatDate(
                route?.params?.startDate
              )} - ${formatDate(route?.params?.endDate)}`;
              return (
                <View style={{ paddingVertical: 4 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.semiBold,
                      fontSize: FONT_SIZE.H6,
                      color: "#fff",
                    }}
                  >
                    {title}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.regular,
                      fontSize: FONT_SIZE.caption,
                      color: "#eee",
                      marginTop: 2,
                    }}
                  >
                    {subtitle}
                  </Text>
                </View>
              );
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleMenuPress(route?.params, navigation)}
                style={{ paddingRight: 10 }}
              >
                <Entypo name="dots-three-vertical" size={16} color="#fff" />
              </TouchableOpacity>
            ),
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerStyle: {
              backgroundColor: COLOR.primary,
              height: 100,
            },
          })}
        />
        <Stack.Screen
          name="itineraryList"
          component={ItineraryList}
          options={{
            title: "Itinerary",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="PlanExpenseInAdvance"
          component={PlanInAdvance}
          options={{
            title: "Planned Costs",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="TrackOnTrip"
          component={TrackOnTrip}
          options={{
            title: "On-Trip Spending",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="traveller"
          component={TravellersScreen}
          options={{
            title: "Travellers",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="invite"
          component={InviteCollaborators}
          options={{
            title: "Invite",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="notification"
          component={NotificationsScreen}
          options={{
            title: "Notifications",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={{
            title: "Profile",
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontFamily: FONTS.semiBold,
              fontSize: FONT_SIZE.H6,
            },
            headerTitleAlign: "center",
            headerStyle: {
              backgroundColor: COLOR.primary,
            },
          }}
        />
      </Stack.Navigator>
      <TopTabMenuModal
        visible={menuModalVisible}
        onClose={() => setMenuModalVisible(false)}
        tripData={currentTripData}
        navigation={navigation}
      />
    </>
  );
}
function MainAppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: "80%",
        },
        swipeEnabled: false,
      }}
    >
      <Drawer.Screen name="MainApp" component={MainStackNavigator} />
    </Drawer.Navigator>
  );
}

export default function RootStack() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Stack.Navigator screenOptions={{ animation: "fade" }}>
      {isLoggedIn ? (
        <Stack.Screen
          name="MainDrawer"
          component={MainAppNavigator}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={AuthScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
