const handleDayPress = (tripData,setTripData,day) => {
    const selectedDate = day.dateString;

    if (!tripData.start || (tripData.start && tripData.end)) {
      // First selection or reset selection
      setTripData((prev) => ({
        ...prev,
        start: selectedDate,
        end: "",
      }));
    } else if (tripData.start && !tripData.end) {
      // Second selection
      const startDateObj = new Date(tripData.start);
      const selectedDateObj = new Date(selectedDate);
      if (selectedDateObj >= startDateObj) {
        setTripData((prev) => ({
          ...prev,
          end: selectedDate,
        }));
      } else {
        // If selected date is before start date, make it the new start date
        setTripData((prev) => ({
          ...prev,
          start: selectedDate,
          end: "",
        }));
      }
    }
  };
  export {handleDayPress}