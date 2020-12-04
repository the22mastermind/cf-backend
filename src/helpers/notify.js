import firebaseInit from '../config/firebaseInit';

const { messaging } = firebaseInit;

const notifyAdmin = async (tokens, data) => {
  const { responses } = await messaging.sendMulticast({ tokens, data });
  return responses;
};

const orderStatusUpdateNotification = async (token, payload) => {
  const dryRun = false;
  const { results } = await messaging.send(
    {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        title: payload.title,
        body: payload.body,
      },
      android: {
        notification: { sound: 'default' },
      },
      apns: {
        payload: { aps: { sound: 'default' } },
      },
      token,
    },
    dryRun,
  );
  return results;
};

export default {
  notifyAdmin,
  orderStatusUpdateNotification,
};
