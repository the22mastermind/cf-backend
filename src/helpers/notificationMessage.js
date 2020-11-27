const notificationMessageBuilder = async (messageType, data) => {
  let notificationData = null;
  if (messageType === 'processing') {
    const { orderId, riderName } = data;
    notificationData = {
      title: `Your order #${orderId} has been accepted!`,
      body: `Hi, I'm ${riderName}. I will be delivering your order today.`,
    };
  }
  if (messageType === 'ontheway') {
    const { orderId, riderName } = data;
    notificationData = {
      title: 'Heads up!',
      body: `Rider ${riderName} is on the way with your order #${orderId}`,
    };
  }
  if (messageType === 'arrived') {
    const { riderName } = data;
    notificationData = {
      title: 'Heads up!',
      body: `Rider ${riderName} has arrived at your location. Enjoy!`,
    };
  }
  return notificationData;
};

export default {
  notificationMessageBuilder,
};
