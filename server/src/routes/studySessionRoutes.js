const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  startStudySession,
  endStudySession,
  getStudySessions,
  getStudySession,
} = require("../controllers/studySessionController");

const router = express.Router();

router.get("/", protect, getStudySessions);

router.get("/:sessionId", protect, getStudySession);

router.post("/:roomId/start", protect, startStudySession);

router.post("/end", protect, endStudySession);

module.exports = router;
