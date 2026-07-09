const { body } = require("express-validator");

const sendMessageValidator = [
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 500 })
    .withMessage("Message cannot exceed 500 characters"),
];

module.exports = {
  sendMessageValidator,
};
