// Function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}`;
};

// Function to add days to a date
const addDays = (dateString, days) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

// Function to calculate days between two dates
const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = end.getTime() - start.getTime();
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24)) + 1;
  return daysDifference;
};

// Generate journey days based on trip data
const generateJourneyDays = (tripData) => {
  if (!tripData || !tripData.startDate || !tripData.endDate) {
    return [];
  }

  const totalDays = calculateDaysBetween(tripData.startDate, tripData.endDate);
  const journeyDays = [];

  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(tripData.startDate, i);
    const formattedDate = formatDate(currentDate);

    let dayTitle;
    if (totalDays === 1) {
      dayTitle = `One Day Trip to ${tripData.destination}`;
    } else if (i === totalDays - 1) {
      dayTitle = `Good Bye ${tripData.destination}`;
    } else {
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };
      dayTitle = `${tripData.destination} ${getOrdinal(i + 1)} day`;
    }

    journeyDays.push({
      id: `day-${i + 1}`,
      title: dayTitle,
      date: formattedDate,
      dayNumber: i + 1,
      rawDate: currentDate,
    });
  }

  return journeyDays;
};
export { generateJourneyDays };
