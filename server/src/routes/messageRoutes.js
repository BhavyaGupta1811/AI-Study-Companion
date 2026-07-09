const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  sendRoomMessage,
  getMessages,
  removeMessage,
} = require("../controllers/messageController");

const { sendMessageValidator } = require("../validators/messageValidator");

const router = express.Router();

router.post(
  "/:roomId",
  protect,
  sendMessageValidator,
  validate,
  sendRoomMessage,
);

router.get("/:roomId", protect, getMessages);

router.delete("/:messageId", protect, removeMessage);

module.exports = router;
