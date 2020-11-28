const notificationMessageBuilder = async (messageType, data) => {
  const { orderId, riderName } = data;
  const notificationData = messageType === 'processing' ? {
    title: `Your order #${orderId} has been accepted!`,
    body: `Hi, I'm ${riderName}. I will be delivering your order today.`,
  } : messageType === 'ontheway' ? {
    title: 'Heads up!',
    body: `Rider ${riderName} is on the way with your order #${orderId}`,
  } : messageType === 'arrived' ? {
    title: 'Heads up!',
    body: `Rider ${riderName} has arrived at your location. Enjoy!`,
  } : {
    title: 'Thank you!',
    body: 'Thank you for ordering with Chow Food! See you soon for another order',
  };
  return notificationData;
};

export default {
  notificationMessageBuilder,
};
