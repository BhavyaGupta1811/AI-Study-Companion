const { getDashboard } = require("../services/dashboardService");

const getDashboardStats = async (req, res) => {
  try {
    const dashboard = await getDashboard(req.user._id);

    res.status(200).json({
      success: true,
      dashboard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
