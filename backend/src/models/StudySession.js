const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    // Student whose study session is being tracked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Session start time
    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },

    // Session end time
    endTime: {
      type: Date,
      default: null,
    },

    // Total duration in minutes
    duration: {
      type: Number,
      default: 0,
    },

    // Current session status
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StudySession", studySessionSchema);
