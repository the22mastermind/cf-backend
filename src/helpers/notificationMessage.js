const notificationMessageBuilder = async (messageType, data) => {
  const { orderId, riderName } = data;
  let notificationData = null;
  if (messageType === 'processing') {
    notificationData = {
      title: `Your order #${orderId} has been accepted!`,
      body: `Hi, I'm ${riderName}. I will be delivering your order today.`,
    };
  }
  if (messageType === 'ontheway') {
    notificationData = {
      title: 'Heads up!',
      body: `Rider ${riderName} is on the way with your order #${orderId}`,
    };
  }
  if (messageType === 'arrived') {
    notificationData = {
      title: 'Heads up!',
      body: `Rider ${riderName} has arrived at your location. Enjoy!`,
    };
  }
  if (messageType === 'completed') {
    notificationData = {
      title: 'Thank you!',
      body: 'Thank you for ordering with Chow Food! See you soon for another order',
    };
  }
  return notificationData;
};

export default {
  notificationMessageBuilder,
};
