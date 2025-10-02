const pushAdmin = require("firebase-admin");
const config = require("./hel3ypatient-firebase-adminsdk-wiatc-b4675d3bfa.json");
pushAdmin.initializeApp({
  credential: pushAdmin.credential.cert(config),
  databaseURL: "https://hel3ypatient.firebaseio.com",
});

async function pushNotificationTo(token, data, notification, options) {
  const result = await pushAdmin.messaging().sendToDevice(
    token,
    {
      data,
      notification,
    },
    options
  );
  return result;
}

async function pushDataTo(token, data) {
  const result = await pushAdmin.messaging().sendToDevice(token, {
    data,
  });
  return result;
}

module.exports = {
  pushNotificationTo,
  pushDataTo,
};
