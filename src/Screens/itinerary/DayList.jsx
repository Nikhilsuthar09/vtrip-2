import React from "react";
import Feather from "@expo/vector-icons/Feather";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { COLOR, FONT_SIZE, FONTS } from "../../constants/Theme";
import { useItinerary } from "../../utils/itinerary/UseItinerary";
import {
  formatLastEdited,
  getLastEditedTimestamp,
} from "../../utils/timestamp/formatAndGetTime";
import { generateJourneyDays } from "../../utils/itinerary/generateJourneyDays";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const JourneyItemWithStats = ({ item, tripId, onPress }) => {
  const { itinerary } = useItinerary(tripId, item.id);

  const itemCount = itinerary?.length || 0;
  const lastEdited = getLastEditedTimestamp(itinerary);

  return (
    <TouchableOpacity style={styles.journeyItem} onPress={onPress}>
      <View style={styles.journeyContent}>
        <View style={styles.journeyInfo}>
          <Text style={styles.journeyTitle}>{item.title}</Text>
          <View style={styles.dateContainer}>
            <Feather
              name="calendar"
              style={styles.calendarIcon}
              color={COLOR.placeholder}
            />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>

          {/* Item Count and Last Edited */}
          <View style={styles.metaContainer}>
            <View style={styles.itemCountContainer}>
              <Feather
                name="list"
                size={12}
                color={COLOR.grey}
                style={styles.metaIcon}
              />
              <Text style={styles.metaText}>
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Text>
            </View>

            {lastEdited && (
              <View style={styles.lastEditedContainer}>
                <Feather
                  name="clock"
                  size={12}
                  color={COLOR.grey}
                  style={styles.metaIcon}
                />
                <Text style={styles.metaText}>
                  {formatLastEdited(lastEdited)}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const JourneysList = ({ tripData }) => {
  const navigation = useNavigation();

  const journeyDays = generateJourneyDays(tripData);

  const renderJourneyItem = ({ item }) => {
    return (
      <>
        <JourneyItemWithStats
          item={item}
          tripId={tripData.id}
          onPress={() => {
            navigation.navigate("itineraryList", { item, tripData });
          }}
        />
      </>
    );
  };

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} style={styles.container}>
      <FlatList
        data={journeyDays}
        renderItem={renderJourneyItem}
        keyExtractor={(item) => item.id}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    padding: 20,
    paddingBottom: 100,
  },
  journeyItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  journeyContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  journeyInfo: {
    flex: 1,
  },
  journeyTitle: {
    fontSize: FONT_SIZE.bodyLarge,
    fontFamily: FONTS.semiBold,
    color: COLOR.primary,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calendarIcon: {
    marginRight: 6,
    fontSize: 14,
  },
  dateText: {
    fontSize: FONT_SIZE.body,
    color: "#666",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  itemCountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastEditedContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    marginRight: 4,
  },
  metaText: {
    fontSize: FONT_SIZE.caption,
    color: COLOR.grey,
    fontFamily: FONTS.regular,
  },
  separator: {
    height: 12,
  },
});

export default JourneysList;
