const StudySession = require("../models/StudySession");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch all completed study sessions
    const sessions = await StudySession.find({
      user: req.user._id,
      status: "completed",
    }).sort({ createdAt: -1 });

    // Recent 5 sessions
    const recentSessions = sessions.slice(0, 5);

    // Total sessions completed
    const totalSessions = sessions.length;

    // Total study time (minutes)
    const totalStudyMinutes = sessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    // Total study time (hours)
    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    // Today's sessions
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter(
      (session) => session.createdAt >= today,
    );

    const todayStudyMinutes = todaySessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    const todayStudyHours = Number((todayStudyMinutes / 60).toFixed(2));

    // Daily goal
    const dailyTargetHours = user.dailyStudyTarget;

    const goalCompleted = todayStudyHours >= dailyTargetHours;

    const goalProgress = Math.min(
      Number(((todayStudyHours / dailyTargetHours) * 100).toFixed(1)),
      100,
    );

    return res.status(200).json({
      success: true,
      dashboard: {
        totalSessions,
        totalStudyHours,
        todayStudyHours,
        dailyTargetHours,
        streak: user.streak,
        recentSessions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
