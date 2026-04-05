const { body } = require("express-validator");

const registerValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .bail()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .optional()
    .isIn(["Viewer", "Analyst", "Admin"])
    .withMessage("Role must be Viewer, Analyst, or Admin."),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be active or inactive.")
];

const loginValidationRules = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Email must be valid.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
];

module.exports = {
  registerValidationRules,
  loginValidationRules
};
