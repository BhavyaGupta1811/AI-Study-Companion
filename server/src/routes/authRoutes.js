const express = require("express");

const {
  register,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
} = require("../validators/authValidator");
const validate = require("../middleware/validate");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post("/logout", protect, logout);

router.get("/me", protect, getCurrentUser);

module.exports = router;
