const Message = require("../models/Message");
const StudyRoom = require("../models/StudyRoom");
const moderateMessage = require("../utils/moderateMessage");

const sendMessage = async (roomId, userId, text) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  const isMember = room.members.some(
    (member) => member.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new Error("Join the room first");
  }

  const moderationResult = moderateMessage(text);

  if (!moderationResult.allowed) {
    throw new Error(moderationResult.reason);
  }

  const message = await Message.create({
    room: roomId,
    sender: userId,
    text,
  });

  return await message.populate("sender", "name profilePicture");
};

const getRoomMessages = async (roomId, page, limit) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    room: roomId,
  })
    .populate("sender", "name profilePicture")
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit);

  const totalMessages = await Message.countDocuments({
    room: roomId,
  });

  return {
    messages,
    totalMessages,
    currentPage: page,
    totalPages: Math.ceil(totalMessages / limit),
  };
};

const deleteMessage = async (messageId, userId) => {
  const message = await Message.findById(messageId);

  if (!message) {
    throw new Error("Message not found");
  }

  if (message.sender.toString() !== userId.toString()) {
    throw new Error("You can delete only your own messages");
  }

  await message.deleteOne();
};

module.exports = {
  sendMessage,
  getRoomMessages,
  deleteMessage,
};
