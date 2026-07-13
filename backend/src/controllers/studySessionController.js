const StudySession = require("../models/StudySession");

// Start a new study session
const startStudySession = async (req, res) => {
  try {
    // Check if user already has an active session
    const existingSession = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "You already have an active study session",
      });
    }

    const session = await StudySession.create({
      user: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Study session started",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// End the current study session
const endStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active study session found",
      });
    }

    session.endTime = new Date();

    session.duration = Math.max(
      1,
      Math.floor((session.endTime - session.startTime) / (1000 * 60)),
    );

    session.status = "completed";

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Study session ended",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all study sessions of the logged-in user
const getStudySessions = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const sessions = await StudySession.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalSessions = await StudySession.countDocuments({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      sessions,
      totalSessions,
      currentPage: page,
      totalPages: Math.ceil(totalSessions / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get one study session
const getStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getActiveStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active study session",
      });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
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
  getActiveStudySession,
};
