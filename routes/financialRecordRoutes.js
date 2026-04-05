const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
} = require("../controllers/financialRecordController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeAccess } = require("../middleware/rbacMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createRecordValidationRules,
  updateRecordValidationRules,
  deleteRecordValidationRules,
  getRecordsValidationRules
} = require("../middleware/financialRecordValidation");

const router = express.Router();

router.use(protect);

router.get("/", getRecordsValidationRules, validateRequest, authorizeAccess("read"), getRecords);
router.post(
  "/",
  createRecordValidationRules,
  validateRequest,
  authorizeAccess("create"),
  createRecord
);
router.put(
  "/:id",
  updateRecordValidationRules,
  validateRequest,
  authorizeAccess("update"),
  updateRecord
);
router.delete(
  "/:id",
  deleteRecordValidationRules,
  validateRequest,
  authorizeAccess("delete"),
  deleteRecord
);

module.exports = router;
