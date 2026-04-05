const { body, param, query } = require("express-validator");

const allowedTypes = ["income", "expense"];

const createRecordValidationRules = [
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),
  body("type")
    .notEmpty()
    .withMessage("Type is required.")
    .bail()
    .isIn(allowedTypes)
    .withMessage("Type must be income or expense."),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required."),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date."),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string.")
];

const updateRecordValidationRules = [
  param("id")
    .isMongoId()
    .withMessage("Record ID must be a valid MongoDB ObjectId."),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0."),
  body("type")
    .optional()
    .isIn(allowedTypes)
    .withMessage("Type must be income or expense."),
  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty."),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date."),
  body("notes")
    .optional()
    .isString()
    .withMessage("Notes must be a string.")
];

const deleteRecordValidationRules = [
  param("id")
    .isMongoId()
    .withMessage("Record ID must be a valid MongoDB ObjectId.")
];

const getRecordsValidationRules = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date filter must be a valid ISO 8601 date."),
  query("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category filter cannot be empty."),
  query("type")
    .optional()
    .isIn(allowedTypes)
    .withMessage("Type filter must be income or expense.")
];

module.exports = {
  createRecordValidationRules,
  updateRecordValidationRules,
  deleteRecordValidationRules,
  getRecordsValidationRules
};
