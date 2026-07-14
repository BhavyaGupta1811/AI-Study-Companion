const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["student", "guardian"],
      default: "student",
    },

    accountabilityPartners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    profilePicture: {
      type: String,
      default:
        "https://ik.imagekit.io/2gnckpnjs/ffa31224f6efb03a7156cfea05b9e5ab.jpg",
    },

    bio: {
      type: String,
      default: "",
      maxlength: 300,
      trim: true,
    },

    college: {
      type: String,
      default: "",
      trim: true,
    },

    course: {
      type: String,
      default: "",
      trim: true,
    },

    year: {
      type: Number,
      min: 1,
      max: 6,
      default: null,
    },

    studyGoal: {
      type: String,
      default: "",
      trim: true,
    },

    dailyStudyTarget: {
      type: Number,
      default: 2,
      min: 1,
      max: 24,
    },

    streak: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    partnerCode: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isNew || this.partnerCode) {
    return next();
  }

  let exists = true;

  while (exists) {
    const code = "FF-" + crypto.randomBytes(3).toString("hex").toUpperCase();

    exists = await mongoose.models.User.exists({ partnerCode: code });

    if (!exists) {
      this.partnerCode = code;
    }
  }

  next();
});

module.exports = mongoose.model("User", userSchema);
