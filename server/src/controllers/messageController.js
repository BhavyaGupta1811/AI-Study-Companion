const {
  sendMessage,
  getRoomMessages,
  deleteMessage,
} = require("../services/messageService");

const sendRoomMessage = async (req, res) => {
  try {
    const message = await sendMessage(
      req.params.roomId,
      req.user._id,
      req.body.text,
    );

    res.status(201).json({
      success: true,
      message: "Message sent",
      data: message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const result = await getRoomMessages(req.params.roomId, page, limit);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeMessage = async (req, res) => {
  try {
    await deleteMessage(req.params.messageId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendRoomMessage,
  getMessages,
  removeMessage,
};
