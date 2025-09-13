export const tripJoinReqBody = (username, tripTitle, destination) => {
  const body = {
    TITLE: "New Join Request 🚀",
    BODY: `${username} has requested to join your trip "${tripTitle}" to ${destination}. Tap to accept or reject.`,
  };
  return body;
};

export const reqAcceptedBody = (ownerName) => {
  const body = {
    TITLE: "Request Accepted 🎉",
    BODY: `Your request to join the trip has been accepted by ${ownerName}.`,
  };
  return body;
};
export const notificationType = {
  JOIN_REQUEST: "join_request",
  REQST_ACCEPTED: "req_accepted",
};
export const status = {
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  PENDING: "pending",
};
