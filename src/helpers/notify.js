import firebaseInit from '../config/firebaseInit';

const { messaging } = firebaseInit;

const sendNotificationToClient = async (tokens, data) => {
  const { responses } = await messaging.sendMulticast({ tokens, data });
  return responses;
};

const orderStatusUpdateNotification = async (token, payload) => {
  const { results } = await messaging.sendToDevice(
    token,
    {
      notification: {
        title: payload.title,
        body: payload.body,
      },
    },
    { contentAvailable: true, priority: 'high' },
  );
  return results;
};

export default {
  sendNotificationToClient,
  orderStatusUpdateNotification,
};
