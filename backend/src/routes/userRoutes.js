const express = require("express");

const protect = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  connectPartner,
  disconnectPartner,
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

router.delete("/disconnect-partner/:partnerId", protect, disconnectPartner);

router.delete("/profile", protect, deleteUserAccount);

module.exports = router;
