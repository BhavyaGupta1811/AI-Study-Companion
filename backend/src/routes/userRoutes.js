const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  connectPartner,
} = require("../controllers/userController");

const { updateProfileValidator } = require("../validators/userValidator");

const router = express.Router();

router.get("/profile", protect, getUserProfile);

router.put(
  "/profile",
  protect,
  updateProfileValidator,
  validate,
  updateUserProfile,
);

router.post("/connect-partner", protect, connectPartner);

router.delete("/profile", protect, deleteUserAccount);

module.exports = router;
