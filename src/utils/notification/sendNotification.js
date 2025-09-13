export const sendPushNotification = async (expoPushToken, data, screen) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: data.TITLE,
    body: data.BODY,
    data: { screen },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
