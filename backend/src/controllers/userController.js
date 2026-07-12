const User = require("../models/User");

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("accountabilityPartner", "name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update logged-in user's profile
const updateUserProfile = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "bio",
      "profilePicture",
      "college",
      "course",
      "year",
      "studyGoal",
      "dailyStudyTarget",
      "accountabilityPartner",
    ];

    if (
      req.body.accountabilityPartner &&
      req.body.accountabilityPartner === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as accountability partner",
      });
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    
    if (updates.accountabilityPartner) {
      const partner = await User.findById(updates.accountabilityPartner);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Accountability partner not found",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate("accountabilityPartner", "name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete logged-in user's account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
};
