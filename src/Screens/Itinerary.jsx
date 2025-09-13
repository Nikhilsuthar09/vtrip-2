import JourneysList from "./itinerary/DayList";

const Itinerary = ({ route }) => {
  const tripData = route.params;
  return <JourneysList tripData={tripData} />;
};

export default Itinerary;
