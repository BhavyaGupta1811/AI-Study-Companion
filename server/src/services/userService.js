const User = require("../models/User");

const getProfile = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const updateProfile = async (userId, data) => {
  const allowedFields = [
    "name",
    "bio",
    "profilePicture",
    "college",
    "course",
    "year",
    "studyGoal",
    "dailyStudyTarget",
    "timezone",
  ];

  const updates = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updates[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const deleteAccount = async (userId) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return;
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};
