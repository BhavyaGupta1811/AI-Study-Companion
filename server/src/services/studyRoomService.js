const StudyRoom = require("../models/StudyRoom");
const generateJoinCode = require("../utils/generateJoinCode");

const createRoom = async (userId, roomData) => {
  let joinCode;
  let exists = true;

  while (exists) {
    joinCode = generateJoinCode();
    exists = await StudyRoom.findOne({ joinCode });
  }

  const room = await StudyRoom.create({
    name: roomData.name,
    description: roomData.description || "",
    isPrivate: roomData.isPrivate || false,
    maxMembers: roomData.maxMembers || 50,
    createdBy: userId,
    members: [userId],
    joinCode,
  });

  return room.populate("createdBy", "name email");
};

const getAllRooms = async () => {
  return StudyRoom.find({ status: "active" })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

const getRoomById = async (roomId) => {
  const room = await StudyRoom.findById(roomId)
    .populate("createdBy", "name email")
    .populate("members", "name email profilePicture");

  if (!room) {
    throw new Error("Study room not found");
  }

  return room;
};

const joinRoom = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  if (room.status !== "active") {
    throw new Error("Room is not active");
  }

  if (room.members.includes(userId)) {
    throw new Error("Already joined");
  }

  if (room.members.length >= room.maxMembers) {
    throw new Error("Room is full");
  }

  room.members.push(userId);

  await room.save();

  return getRoomById(room._id);
};

const leaveRoom = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  if (room.createdBy.toString() === userId.toString()) {
    throw new Error("Room creator cannot leave the room");
  }

  room.members = room.members.filter(
    (member) => member.toString() !== userId.toString(),
  );

  await room.save();

  return getRoomById(room._id);
};

const updateRoom = async (roomId, userId, data) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  if (room.createdBy.toString() !== userId.toString()) {
    throw new Error("Only room creator can update the room");
  }

  const allowedFields = [
    "name",
    "description",
    "isPrivate",
    "maxMembers",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      room[field] = data[field];
    }
  });

  await room.save();

  return getRoomById(room._id);
};

const deleteRoom = async (roomId, userId) => {
  const room = await StudyRoom.findById(roomId);

  if (!room) {
    throw new Error("Study room not found");
  }

  if (room.createdBy.toString() !== userId.toString()) {
    throw new Error("Only room creator can delete the room");
  }

  await room.deleteOne();
};

const joinRoomByCode = async (joinCode, userId) => {
  const room = await StudyRoom.findOne({ joinCode: joinCode.toUpperCase() });

  if (!room) {
    throw new Error("Invalid join code");
  }

  if (room.status !== "active") {
    throw new Error("Room is not active");
  }

  if (room.members.some((member) => member.toString() === userId.toString())) {
    throw new Error("You are already a member of this room");
  }

  if (room.members.length >= room.maxMembers) {
    throw new Error("Room is full");
  }

  room.members.push(userId);

  await room.save();

  return getRoomById(room._id);
};

module.exports = {
  createRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  joinRoomByCode,
  leaveRoom,
  updateRoom,
  deleteRoom,
};
