import firebaseInit from '../config/firebaseInit';

const { messaging } = firebaseInit;

const sendNotificationToClient = async (tokens, data) => {
  const { responses } = await messaging.sendMulticast({ tokens, data });
  return responses;
};

export default {
  sendNotificationToClient,
};
