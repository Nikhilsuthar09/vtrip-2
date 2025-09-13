// function to format last edited timestamp
const formatLastEdited = (timestamp) => {
  if (!timestamp) return "Never";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    return diffInMinutes < 1 ? "Just now" : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

// function to get last edited timestamp
const getLastEditedTimestamp = (items) => {
  if (!items || items.length === 0) return null;

  const timestamps = items
    .map((item) => {
      const updatedAt = item.updatedAt?.toDate?.() || item.updatedAt;
      return updatedAt ? new Date(updatedAt) : null;
    })
    .filter(Boolean);

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps.map((t) => t.getTime())));
};

// Format time for display
const formatTime = (date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
// Format date and time for display
const formatDateTime = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
// function to get last edited timestamp
const getLastEditedForCreated = (items) => {
  if (!items || items.length === 0) return null;

  const timestamps = items
    .map((item) => {
      const createdAt = item.createdAt?.toDate?.() || item.createdAt;
      return createdAt ? new Date(createdAt) : null;
    })
    .filter(Boolean);

  if (timestamps.length === 0) return null;

  return new Date(Math.max(...timestamps.map((t) => t.getTime())));
};

export {
  formatLastEdited,
  getLastEditedTimestamp,
  formatTime,
  formatDateTime,
  getLastEditedForCreated,
};
