const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: {
      type: Date,
      default: Date.now,
      required: true,
    },

    currentStudyStartedAt: {
      type: Date,
      default: Date.now,
    },

    endTime: {
      type: Date,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    partnerAlertSent: {
      type: Boolean,
      default: false,
    },
    studyDuration: {
      type: Number,
      default: 25,
    },

    breakDuration: {
      type: Number,
      default: 5,
    },

    onBreak: {
      type: Boolean,
      default: false,
    },

    breakStartedAt: {
      type: Date,
      default: null,
    },
    breakReminderCount: {
      type: Number,
      default: 0,
    },

    lastBreakReminderAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

studySessionSchema.index({ user: 1, createdAt: -1 });
studySessionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("StudySession", studySessionSchema);
