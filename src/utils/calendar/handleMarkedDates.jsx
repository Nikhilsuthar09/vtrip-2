import { COLOR } from "../../constants/Theme";

// create marked date objects
const getMarkedDates = (tripData) => {
  let markedDates = {};
  if (tripData.start && tripData.end) {
    // range selection
    markedDates = getDatesInRange(tripData.start, tripData.end);
    markedDates[tripData.start] = {
      ...markedDates[tripData.start],
      startingDay: true,
      color: COLOR.primaryLight,
      textColor: "black",
    };
    markedDates[tripData.end] = {
      ...markedDates[tripData.end],
      endingDay: true,
      color: COLOR.primaryLight,
      textColor: "black",
    };
  } else if (tripData.start) {
    markedDates[tripData.start] = {
      startingDay: true,
      endingDay: true,
      color: COLOR.primaryLight,
      textColor: "black",
    };
  }
  return markedDates;
};

const getDatesInRange = (start, end) => {
  const dates = {};
  const startDateObj = new Date(start);
  const endDateObj = new Date(end);

  if (startDateObj > endDateObj) return dates;

  const currentDate = new Date(startDateObj);
  while (currentDate <= endDateObj) {
    const dateString = currentDate.toISOString().split("T")[0];
    dates[dateString] = {
      color: COLOR.primaryLight,
      textColor: "black",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
export { getMarkedDates };
