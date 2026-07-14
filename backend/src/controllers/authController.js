const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const register = async (req, res) => {
  try {
    let {
      name,
      email,
      password,
      role,
      college,
      course,
      year,
      dailyStudyTarget,
      studyGoal,
      bio,
    } = req.body;

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email,
      password: hashedPassword,

      role: role || "student",

      college: college?.trim() || "",
      course: course?.trim() || "",
      year: year || null,

      dailyStudyTarget: dailyStudyTarget || 2,

      studyGoal: studyGoal?.trim() || "",
      bio: bio?.trim() || "",
    });

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        profilePicture: user.profilePicture,

        college: user.college,
        course: user.course,
        year: user.year,

        dailyStudyTarget: user.dailyStudyTarget,

        studyGoal: user.studyGoal,
        bio: user.bio,

        accountabilityPartners: user.accountabilityPartners,

        partnerCode: user.partnerCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Registration failed.",
    });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

        profilePicture: user.profilePicture,

        college: user.college,
        course: user.course,
        year: user.year,

        dailyStudyTarget: user.dailyStudyTarget,

        studyGoal: user.studyGoal,
        bio: user.bio,

        accountabilityPartners: user.accountabilityPartners,

        partnerCode: user.partnerCode,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

const getCurrentUser = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
};
