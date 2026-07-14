const Message = require("../models/Message");
const User = require("../models/User");

const sendStudyWarning = async (userId, warningText) => {
  const user = await User.findById(userId).lean();

  if (!user || !user.accountabilityPartners?.length) {
    return;
  }

  const messages = user.accountabilityPartners.map((partnerId) => ({
    sender: userId,
    receiver: partnerId,
    text: warningText,
    systemMessage: true,
  }));

  await Message.insertMany(messages);
};

module.exports = sendStudyWarning;
