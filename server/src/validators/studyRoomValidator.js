const { body } = require("express-validator");



const createRoomValidator = [

  
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Room name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Room name must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be boolean"),

  body("maxMembers")
    .optional()
    .isInt({ min: 2, max: 500 })
    .withMessage("Maximum members must be between 2 and 500"),
];

const joinRoomValidator = [
  body("joinCode")
    .trim()
    .notEmpty()
    .withMessage("Join code is required")
    .isLength({ min: 8, max: 8 })
    .withMessage("Invalid join code"),
];
module.exports = {
  createRoomValidator,
  joinRoomValidator,
};
