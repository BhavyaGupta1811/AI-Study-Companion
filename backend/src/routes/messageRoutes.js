const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  sendMessage,
  getMessages,
  removeMessage,
  getWarnings,
  getUnreadCounts,
} = require("../controllers/messageController");

const { sendMessageValidator } = require("../validators/messageValidator");

const router = express.Router();

router.post("/", protect, sendMessageValidator, validate, sendMessage);

router.get("/", protect, getMessages);

router.get("/unread", protect, getUnreadCounts);

router.delete("/:messageId", protect, removeMessage);

router.get("/warnings", protect, getWarnings);


module.exports = router;
