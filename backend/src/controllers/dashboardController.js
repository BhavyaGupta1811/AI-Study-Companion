const StudySession = require("../models/StudySession");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const sessions = await StudySession.find({
      user: req.user._id,
      status: "completed",
    })
      .sort({ createdAt: -1 })
      .lean();

    const recentSessions = sessions.slice(0, 5);

    const totalSessions = sessions.length;

    const totalStudyMinutes = sessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

    // Today's Study
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySessions = sessions.filter(
      (session) => new Date(session.createdAt) >= today,
    );

    const todayStudyMinutes = todaySessions.reduce(
      (sum, session) => sum + session.duration,
      0,
    );

    const todayStudyHours = Number((todayStudyMinutes / 60).toFixed(2));

    // Daily Goal
    const dailyTargetHours = user.dailyStudyTarget || 0;

    const goalCompleted = todayStudyHours >= dailyTargetHours;

    const goalProgress =
      dailyTargetHours > 0
        ? Math.min(
            Number(((todayStudyHours / dailyTargetHours) * 100).toFixed(1)),
            100,
          )
        : 0;

    // Weekly Activity (Last 7 Days)
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyActivity = [];

    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - i);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const dayMinutes = sessions
        .filter((session) => {
          const date = new Date(session.createdAt);
          return date >= start && date < end;
        })
        .reduce((sum, session) => sum + session.duration, 0);

      weeklyActivity.push({
        day: weekDays[start.getDay()],
        hours: Number((dayMinutes / 60).toFixed(1)),
      });
    }

    // Average Daily Study (Last 7 Days)
    const averageDailyStudy = Number((totalStudyHours / 7).toFixed(1));

    return res.status(200).json({
      success: true,
      dashboard: {
        totalSessions,
        totalStudyHours,
        todayStudyHours,
        dailyTargetHours,
        goalCompleted,
        goalProgress,
        averageDailyStudy,
        weeklyActivity,
        streak: user.streak,
        recentSessions,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data.",
    });
  }
};

module.exports = {
  getDashboardStats,
};
