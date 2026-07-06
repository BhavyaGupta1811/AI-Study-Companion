const mongoose = require("mongoose");

const studyRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Room name is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isPrivate: {
      type: Boolean,
      default: false,
    },

    joinCode: {
      type: String,
      unique: true,
      required: true,
    },

    maxMembers: {
      type: Number,
      default: 50,
      min: 2,
      max: 500,
    },

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("StudyRoom", studyRoomSchema);
