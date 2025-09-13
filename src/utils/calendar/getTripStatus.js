  // Function to get trip status
 export const getTripStatus = (startDate, endDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Reset time to compare dates only
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start) {
      return 'upcoming';
    } else if (today > end) {
      return 'completed';
    } else {
      return 'ongoing';
    }
  };