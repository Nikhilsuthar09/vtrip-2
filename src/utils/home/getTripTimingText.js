 // Calculate trip timing text based on status
  export const getTripTimingText = (trip) => {
    if (!trip) return "No active trips";

    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);

    if (trip.status === "ongoing") {
      const diffTime = endDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0
        ? `${diffDays} ${diffDays === 1 ? "day" : "days"} remaining`
        : "Trip ending today";
    } else {
      // upcoming
      const diffTime = startDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0
        ? `${diffDays} ${diffDays === 1 ? "day" : "days"} left`
        : "Trip starts today";
    }
  };