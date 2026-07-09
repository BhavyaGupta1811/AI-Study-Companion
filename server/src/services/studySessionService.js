const StudySession = require("../models/StudySession");
const StudyRoom = require("../models/StudyRoom");

const startSession = async (userId, roomId) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  const isMember = room.members.some(
    (member) => member.toString() === userId.toString(),
  );

  if (!isMember) {
    throw new Error("Join the room before starting a session");
  }

  const existingSession = await StudySession.findOne({
    user: userId,
    status: "active",
  });

  if (existingSession) {
    throw new Error("You already have an active study session");
  }

  return StudySession.create({
    user: userId,
    room: roomId,
  });
};

const endSession = async (userId) => {
  const session = await StudySession.findOne({
    user: userId,
    status: "active",
  });

  if (!session) {
    throw new Error("No active study session found");
  }

  session.endTime = new Date();

  session.duration = Math.floor(
    (session.endTime - session.startTime) / (1000 * 60),
  );

  session.status = "completed";

  await session.save();

  return session;
};

const getMySessions = async (userId, page, limit) => {
  const skip = (page - 1) * limit;

  const sessions = await StudySession.find({
    user: userId,
  })
    .populate("room", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalSessions = await StudySession.countDocuments({
    user: userId,
  });

  return {
    sessions,
    totalSessions,
    currentPage: page,
    totalPages: Math.ceil(totalSessions / limit),
  };
};

const getSessionById = async (sessionId, userId) => {
  const session = await StudySession.findOne({
    _id: sessionId,
    user: userId,
  }).populate("room", "name");

  if (!session) {
    throw new Error("Study session not found");
  }

  return session;
};

module.exports = {
  startSession,
  endSession,
  getMySessions,
  getSessionById,
};