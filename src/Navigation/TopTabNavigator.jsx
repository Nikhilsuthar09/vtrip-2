import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Itinerary from "../Screens/Itinerary";
import Packing from "../Screens/PackingScreen";
import Expenses from "../Screens/expenses/Expenses";
import { COLOR, FONT_SIZE, FONTS } from "../constants/Theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import useTripDeletionListener from "../utils/tripData/useTripDeletionListener";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({ route }) {
  const { id, budget, destination, startDate, endDate, screen } = route.params;
  useTripDeletionListener(id);

  return (
    <>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName={screen || "Itinerary"}
        screenOptions={{
          tabBarLabelStyle: {
            fontFamily: FONTS.semiBold,
            fontSize: FONT_SIZE.body,
          },
          tabBarIndicatorStyle: {
            height: 0,
          },
          tabBarStyle: {
            backgroundColor: "white",
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarPressColor: "transparent",
        }}
      >
        <Tab.Screen
          name="Itinerary"
          component={Itinerary}
          initialParams={{ id, destination, startDate, endDate }}
          options={{
            headerShown: true,
            tabBarLabel: ({ focused }) => (
              <View
                style={[
                  {
                    backgroundColor: focused
                      ? COLOR.primaryLight
                      : "transparent",
                    borderColor: focused ? COLOR.primaryLight : "transparent",
                    borderWidth: 1,
                    borderRadius: 6,
                  },
                  styles.labelContainer,
                ]}
              >
                <FontAwesome5
                  name="list-alt"
                  size={16}
                  color={focused ? COLOR.primary : COLOR.grey}
                />
                <Text
                  style={{
                    color: focused ? COLOR.primary : COLOR.grey,
                    fontSize: FONT_SIZE.body,
                    fontFamily: FONTS.semiBold,
                    marginLeft: 4,
                  }}
                >
                  Itinerary
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Packing"
          initialParams={{ id }}
          component={Packing}
          options={{
            tabBarLabel: ({ focused }) => (
              <View
                style={[
                  {
                    backgroundColor: focused
                      ? COLOR.primaryLight
                      : "transparent",
                    borderColor: focused ? COLOR.primaryLight : "transparent",
                    borderWidth: 1,
                    borderRadius: 6,
                  },
                  styles.labelContainer,
                ]}
              >
                <MaterialIcons
                  name="card-travel"
                  size={16}
                  color={focused ? COLOR.primary : COLOR.grey}
                />
                <Text
                  style={{
                    color: focused ? COLOR.primary : COLOR.grey,
                    fontSize: FONT_SIZE.body,
                    fontFamily: FONTS.semiBold,
                    marginLeft: 4,
                  }}
                >
                  Packing
                </Text>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Expenses"
          initialParams={{ id, budget }}
          component={Expenses}
          options={{
            tabBarLabel: ({ focused }) => (
              <View
                style={[
                  {
                    backgroundColor: focused
                      ? COLOR.primaryLight
                      : "transparent",
                    borderColor: focused ? COLOR.primaryLight : "transparent",
                    borderWidth: 1,
                    borderRadius: 6,
                  },
                  styles.labelContainer,
                ]}
              >
                <FontAwesome
                  name="inr"
                  size={16}
                  color={focused ? COLOR.primary : COLOR.grey}
                />
                <Text
                  style={{
                    color: focused ? COLOR.primary : COLOR.grey,
                    fontSize: FONT_SIZE.body,
                    fontFamily: FONTS.semiBold,
                    marginLeft: 4,
                  }}
                >
                  Expenses
                </Text>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
const styles = StyleSheet.create({
  labelContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
