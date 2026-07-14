const User = require("../models/User");

// Get logged-in user's profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate(
        "accountabilityPartners",
        "name email role profilePicture partnerCode",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

// Connect accountability partner
const connectPartner = async (req, res) => {
  try {
    const partnerCode = req.body.partnerCode?.trim().toUpperCase();

    if (!partnerCode) {
      return res.status(400).json({
        success: false,
        message: "Partner code is required.",
      });
    }

    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const partner = await User.findOne({ partnerCode });

    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found.",
      });
    }

    if (partner._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot connect with yourself.",
      });
    }

    if (
      currentUser.accountabilityPartners.some(
        (id) => id.toString() === partner._id.toString(),
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Partner is already connected.",
      });
    }

    currentUser.accountabilityPartners.push(partner._id);

    await currentUser.save();

    await currentUser.populate(
      "accountabilityPartners",
      "name email role profilePicture partnerCode",
    );

    return res.status(200).json({
      success: true,
      message: "Partner connected successfully.",
      user: currentUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect partner.",
    });
  }
};

// Disconnect accountability partner
const disconnectPartner = async (req, res) => {
  try {
    const { partnerId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.accountabilityPartners =
      user.accountabilityPartners.filter(
        (id) => id.toString() !== partnerId
      );

    await user.save();

    await user.populate(
      "accountabilityPartners",
      "name email role profilePicture partnerCode"
    );

    return res.status(200).json({
      success: true,
      message: "Partner disconnected successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to disconnect partner.",
    });
  }
};

// Update profile
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
    ];

    if (
      req.body.accountabilityPartner &&
      req.body.accountabilityPartner === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself as an accountability partner.",
      });
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    ["name", "bio", "college", "course", "studyGoal"].forEach((field) => {
      if (typeof updates[field] === "string") {
        updates[field] = updates[field].trim();
      }
    });

    if (updates.accountabilityPartner) {
      const partner = await User.findById(updates.accountabilityPartner);

      if (!partner) {
        return res.status(404).json({
          success: false,
          message: "Accountability partner not found.",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .populate(
        "accountabilityPartners",
        "name email role profilePicture partnerCode",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};

// Delete account
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete account.",
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  connectPartner,
  disconnectPartner,
};