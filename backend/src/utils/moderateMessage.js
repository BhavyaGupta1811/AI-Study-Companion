const Filter = require("bad-words");

const filter = new Filter();

const moderateMessage = (message = "") => {
  const text = message.trim();

  if (!text) {
    return {
      allowed: false,
      reason: "Message cannot be empty",
    };
  }

  if (text.length > 500) {
    return {
      allowed: false,
      reason: "Message cannot exceed 500 characters",
    };
  }

  if (filter.isProfane(text)) {
    return {
      allowed: false,
      reason: "Message contains inappropriate language",
    };
  }

  if (/(.)\1{9,}/.test(text)) {
    return {
      allowed: false,
      reason: "Spam message detected",
    };
  }

  return {
    allowed: true,
  };
};

module.exports = moderateMessage;
