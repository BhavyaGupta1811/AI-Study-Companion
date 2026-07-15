const StudySession = require("../models/StudySession");
const User = require("../models/User");
const Message = require("../models/Message");
// Start a new study session
const startStudySession = async (req, res) => {
  try {
    const studyDuration = Number(req.body.studyDuration) || 25;
    const breakDuration = Number(req.body.breakDuration) || 5;

    const existingSession = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "You already have an active study session.",
      });
    }

    const now = new Date();

    const session = await StudySession.create({
      user: req.user._id,
      studyDuration,
      breakDuration,
      startTime: now,
      currentStudyStartedAt: now,
    });

    return res.status(201).json({
      success: true,
      message: "Study session started.",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to start study session.",
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
        message: "No active study session found.",
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
      message: "Study session ended.",
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to end study session.",
    });
  }
};

// Get all study sessions
const getStudySessions = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const sessions = await StudySession.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

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
      message: "Failed to fetch study sessions.",
    });
  }
};

// Get one study session
const getStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.sessionId,
      user: req.user._id,
    }).lean();

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found.",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch study session.",
    });
  }
};

// Get active study session
const getActiveStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(200).json({
        success: true,
        session: null,
      });
    }

    const now = new Date();

    if (!session.onBreak) {
      const studyMinutes = Math.floor(
        (now - session.currentStudyStartedAt) / (1000 * 60),
      );

      if (studyMinutes >= session.studyDuration) {
        session.onBreak = true;
        session.breakReminderCount = 0;

        session.lastBreakReminderAt = null;
        session.breakStartedAt = now;

        await session.save();
      }
    } else {
      const breakMinutes = Math.floor(
        (now - session.breakStartedAt) / (1000 * 60),
      );
      if (breakMinutes >= session.breakDuration) {
        // Break has ended.
        // Keep the session in break mode.
        // Frontend will show reminder popup.
        // Study resumes only when user clicks "Continue Studying".
      }

    }

   return res.status(200).json({
     success: true,
     session,
   });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active study session.",
    });
  }
};

// Handle ignored study reminder
const handleStudyReminder = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active study session found.",
      });
    }

    const now = new Date();

    if (
      session.lastBreakReminderAt &&
      now - session.lastBreakReminderAt < 5 * 60 * 1000
    ) {
      return res.status(200).json({
        success: true,
        breakReminderCount: session.breakReminderCount,
      });
    }

    session.breakReminderCount += 1;
    session.lastBreakReminderAt = now;

    const reminderLimit = 3;

    if (
      session.breakReminderCount >= reminderLimit &&
      !session.partnerAlertSent
    ) {
      const user = await User.findById(req.user._id);

      if (user && user.accountabilityPartners?.length > 0) {
        const messages = user.accountabilityPartners.map((partner) => ({
          sender: req.user._id,
          receiver: partner,
          text: `${user.name} has been ignoring study reminders. Encourage them to stay focused.`,
          systemMessage: true,
        }));

        await Message.insertMany(messages);

        session.partnerAlertSent = true;
      }
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Reminder handled.",
      breakReminderCount: session.breakReminderCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to handle reminder.",
    });
  }
};

const getStudyAnalytics = async (req, res) => {
  try {
    const sessions = await StudySession.find({
      user: req.user._id,
      status: "completed",
    }).lean();

    const totalSessions = sessions.length;

    const totalMinutes = sessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    const averageSession =
      totalSessions > 0 ? Number((totalMinutes / totalSessions).toFixed(1)) : 0;

    const longestSession =
      totalSessions > 0 ? Math.max(...sessions.map((s) => s.duration)) : 0;

    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setMonth(now.getMonth() - 1);

    const weeklyMinutes = sessions
      .filter((s) => new Date(s.createdAt) >= weekStart)
      .reduce((sum, s) => sum + s.duration, 0);

    const monthlyMinutes = sessions
      .filter((s) => new Date(s.createdAt) >= monthStart)
      .reduce((sum, s) => sum + s.duration, 0);

    const dailyProgress = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const minutes = sessions
        .filter(
          (session) =>
            new Date(session.createdAt) >= start &&
            new Date(session.createdAt) < end,
        )
        .reduce((sum, session) => sum + session.duration, 0);

      dailyProgress.push({
        day: start.toLocaleDateString("en-IN", {
          weekday: "short",
        }),
        hours: Number((minutes / 60).toFixed(1)),
      });
    }

    const studyDays = [
      ...new Set(
        sessions.map((session) => {
          const d = new Date(session.createdAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        }),
      ),
    ].sort((a, b) => b - a);

    let currentStreak = 0;

    if (studyDays.length) {
      let expected = new Date();
      expected.setHours(0, 0, 0, 0);

      if (studyDays[0] !== expected.getTime()) {
        expected.setDate(expected.getDate() - 1);
      }

      for (const day of studyDays) {
        if (day === expected.getTime()) {
          currentStreak++;
          expected.setDate(expected.getDate() - 1);
        } else {
          break;
        }
      }
    }
    return res.status(200).json({
      success: true,
      analytics: {
        averageSession,
        longestSession,
        weeklyHours: Number((weeklyMinutes / 60).toFixed(1)),
        monthlyHours: Number((monthlyMinutes / 60).toFixed(1)),
        dailyProgress,
        currentStreak,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const continueStudying = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      user: req.user._id,
      status: "active",
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "No active session.",
      });
    }

    session.onBreak = false;

    session.breakStartedAt = null;

    session.currentStudyStartedAt = new Date();

    session.breakReminderCount = 0;

    session.lastBreakReminderAt = null;

    session.partnerAlertSent = false;

    await session.save();

    return res.json({
      success: true,
      message: "Activity updated.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update activity.",
    });
  }
};

module.exports = {
  startStudySession,
  endStudySession,
  getStudySessions,
  getStudySession,
  getActiveStudySession,
  getStudyAnalytics,
  handleStudyReminder,
  continueStudying,
};
