const StudySession = require("../models/StudySession");
const User = require("../models/User");

const getDashboard = async (userId) => {
  const user = await User.findById(userId);

  const sessions = await StudySession.find({
    user: userId,
    status: "completed",
  });

  const totalSessions = sessions.length;

  const totalStudyMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0,
  );

  const totalStudyHours = Number((totalStudyMinutes / 60).toFixed(2));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todaySessions = sessions.filter(
    (session) => session.createdAt >= today,
  );

  const todayStudyMinutes = todaySessions.reduce(
    (total, session) => total + session.duration,
    0,
  );

  const todayStudyHours = Number((todayStudyMinutes / 60).toFixed(2));

  const dailyTargetHours = user.dailyStudyTarget;

  const goalCompleted = todayStudyHours >= dailyTargetHours;

  const goalProgress = Math.min(
    Number(((todayStudyHours / dailyTargetHours) * 100).toFixed(1)),
    100,
  );

  return {
    totalSessions,
    totalStudyMinutes,
    totalStudyHours,
    todaySessions: todaySessions.length,
    todayStudyMinutes,
    todayStudyHours,
    dailyTargetHours,
    goalCompleted,
    goalProgress,
  };
};

module.exports = {
  getDashboard,
};
