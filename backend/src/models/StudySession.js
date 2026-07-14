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

    reminderCount: {
      type: Number,
      default: 0,
    },

    partnerAlertSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

studySessionSchema.index({ user: 1, createdAt: -1 });
studySessionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("StudySession", studySessionSchema);
