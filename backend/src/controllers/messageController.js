const Message = require("../models/Message");
const User = require("../models/User");
const moderateMessage = require("../utils/moderateMessage");
// Send message to accountability partner
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;

    // Find logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if accountability partner exists
    if (!user.accountabilityPartner) {
      return res.status(400).json({
        success: false,
        message: "Please add an accountability partner first.",
      });
    }

    const moderation = moderateMessage(text);

    if (!moderation.allowed) {
      return res.status(400).json({
        success: false,
        message: moderation.reason,
      });
    }
    // Create message
    const message = await Message.create({
      sender: req.user._id,
      receiver: user.accountabilityPartner,
      text,
    });

    // Populate sender and receiver details
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
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
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
        message: "User not found",
      });
    }

    if (!user.accountabilityPartner) {
      return res.status(400).json({
        success: false,
        message: "Please add an accountability partner first.",
      });
    }

    const partnerId = user.accountabilityPartner;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
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
      .limit(limit);

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
      message: error.message,
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
        message: "Message not found",
      });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can delete only your own messages",
      });
    }

    await message.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  removeMessage,
};
