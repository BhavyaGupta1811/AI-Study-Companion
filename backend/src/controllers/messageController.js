const Message = require("../models/Message");
const User = require("../models/User");
const moderateMessage = require("../utils/moderateMessage");

// Send message to accountability partner
const sendMessage = async (req, res) => {
  try {
    const { text, partnerId } = req.body;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.accountabilityPartners.length) {
      return res.status(400).json({
        success: false,
        message: "Please connect an accountability partner first.",
      });
    }

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner is required.",
      });
    }

    const isConnected = user.accountabilityPartners.some(
      (id) => id.toString() === partnerId,
    );

    if (!isConnected) {
      return res.status(403).json({
        success: false,
        message: "Invalid partner.",
      });
    }

    const moderation = moderateMessage(text);

    if (!moderation.allowed) {
      return res.status(400).json({
        success: false,
        message: moderation.reason,
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: partnerId,
      text: text.trim(),
    });

    await message.populate([
      {
        path: "sender",
        select: "name profilePicture role",
      },
      {
        path: "receiver",
        select: "name profilePicture role",
      },
    ]);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};

// Get conversation with accountability partner
const getMessages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.accountabilityPartners.length) {
      return res.status(400).json({
        success: false,
        message: "Please add an accountability partner first.",
      });
    }

    const partnerId = req.query.partnerId;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Partner is required.",
      });
    }

    const isConnected = user.accountabilityPartners.some(
      (id) => id.toString() === partnerId,
    );

    if (!isConnected) {
      return res.status(403).json({
        success: false,
        message: "Invalid partner.",
      });
    }
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const query = {
      $or: [
        {
          sender: req.user._id,
          receiver: partnerId,
        },
        {
          sender: partnerId,
          receiver: req.user._id,
        },
      ],
    };

    const messages = await Message.find(query)
      .populate("sender", "name profilePicture role")
      .populate("receiver", "name profilePicture role")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalMessages = await Message.countDocuments(query);

    return res.status(200).json({
      success: true,
      messages,
      totalMessages,
      currentPage: page,
      totalPages: Math.ceil(totalMessages / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
};

// Delete your own message
const removeMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own messages.",
      });
    }

    await message.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  removeMessage,
};
