const {
  createRoom,
  getAllRooms,
  getRoomById,
  joinRoom,
  leaveRoom,
  updateRoom,
  deleteRoom,
  joinRoomByCode,
} = require("../services/studyRoomService");

const createStudyRoom = async (req, res) => {
  try {
    const room = await createRoom(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: "Study room created successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudyRooms = async (req, res) => {
  try {
    const search = req.query.search || "";

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const result = await getAllRooms(search, page, limit);

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

const getStudyRoom = async (req, res) => {
  try {
    const room = await getRoomById(req.params.roomId);

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const joinStudyRoom = async (req, res) => {
  try {
    const room = await joinRoom(req.params.roomId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Joined successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const leaveStudyRoom = async (req, res) => {
  try {
    const room = await leaveRoom(req.params.roomId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Left successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateStudyRoom = async (req, res) => {
  try {
    const room = await updateRoom(req.params.roomId, req.user._id, req.body);

    res.status(200).json({
      success: true,
      message: "Study room updated successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteStudyRoom = async (req, res) => {
  try {
    await deleteRoom(req.params.roomId, req.user._id);

    res.status(200).json({
      success: true,
      message: "Study room deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const joinStudyRoomByCode = async (req, res) => {
  try {
    const room = await joinRoomByCode(req.body.joinCode, req.user._id);

    res.status(200).json({
      success: true,
      message: "Joined study room successfully",
      room,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createStudyRoom,
  getStudyRooms,
  getStudyRoom,
  joinStudyRoom,
  joinStudyRoomByCode,
  leaveStudyRoom,
  updateStudyRoom,
  deleteStudyRoom,
};
