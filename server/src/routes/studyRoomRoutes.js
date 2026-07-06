const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  createStudyRoom,
  getStudyRooms,
  getStudyRoom,
  joinStudyRoom,
  leaveStudyRoom,
  updateStudyRoom,
  deleteStudyRoom,
  joinStudyRoomByCode,
} = require("../controllers/studyRoomController");

const { createRoomValidator, joinRoomValidator } = require("../validators/studyRoomValidator");

const router = express.Router();

router.post("/", protect, createRoomValidator, validate, createStudyRoom);

router.get("/", protect, getStudyRooms);

router.get("/:roomId", protect, getStudyRoom);

router.post("/:roomId/join", protect, joinStudyRoom);

router.post("/:roomId/leave", protect, leaveStudyRoom);

router.put("/:roomId", protect, createRoomValidator, validate, updateStudyRoom);

router.delete("/:roomId", protect, deleteStudyRoom);

router.post(
  "/join-by-code",
  protect,
  joinRoomValidator,
  validate,
  joinStudyRoomByCode,
);

module.exports = router;
