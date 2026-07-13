const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  startStudySession,
  endStudySession,
  getStudySessions,
  getStudySession,
  getActiveStudySession,
} = require("../controllers/studySessionController");

const router = express.Router();

router.get("/", protect, getStudySessions);

router.get("/active", protect, getActiveStudySession);

router.get("/:sessionId", protect, getStudySession);

router.post("/start", protect, startStudySession);

router.post("/end", protect, endStudySession);

module.exports = router;
