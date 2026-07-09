const {
  startSession,
  endSession,
  getMySessions,
  getSessionById,
} = require("../services/studySessionService");

const startStudySession = async (req, res) => {
  try {
    const session = await startSession(req.user._id, req.params.roomId);

    res.status(201).json({
      success: true,
      message: "Study session started",
      session,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const endStudySession = async (req, res) => {
  try {
    const session = await endSession(req.user._id);

    res.status(200).json({
      success: true,
      message: "Study session ended",
      session,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getStudySessions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getMySessions(req.user._id, page, limit);

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

const getStudySession = async (req, res) => {
  try {
    const session = await getSessionById(req.params.sessionId, req.user._id);

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  startStudySession,
  endStudySession,
  getStudySessions,
  getStudySession,
};