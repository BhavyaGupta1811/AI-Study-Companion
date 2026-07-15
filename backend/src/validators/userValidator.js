const { body } = require("express-validator");

const updateProfileValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage("Bio cannot exceed 300 characters"),

  body("college")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("College cannot be empty"),

  body("course")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Course cannot be empty"),

  body("year")
    .optional()
    .isInt({ min: 1, max: 6 })
    .withMessage("Year must be between 1 and 6"),

  body("studyGoal")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Study goal cannot be empty"),

  body("dailyStudyTarget")
    .optional()
    .isFloat({ min: 1, max: 24 })
    .withMessage("Daily study target must be between 1 and 24"),

  body("profilePicture").optional().trim(),
];

module.exports = {
  updateProfileValidator,
};
