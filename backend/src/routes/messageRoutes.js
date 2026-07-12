const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  sendMessage,
  getMessages,
  removeMessage,
} = require("../controllers/messageController");

const { sendMessageValidator } = require("../validators/messageValidator");

const router = express.Router();

router.post("/", protect, sendMessageValidator, validate, sendMessage);

router.get("/", protect, getMessages);

router.delete("/:messageId", protect, removeMessage);

module.exports = router;
