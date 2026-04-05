const {
  createFinancialRecord,
  getFinancialRecords,
  updateFinancialRecord,
  deleteFinancialRecord
} = require("../services/financialRecordService");
const asyncHandler = require("../utils/asyncHandler");

const createRecord = asyncHandler(async (req, res) => {
  const record = await createFinancialRecord({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json({
    success: true,
    message: "Financial record created successfully.",
    data: record
  });
});

const getRecords = asyncHandler(async (req, res) => {
  const records = await getFinancialRecords(req.query);

  res.status(200).json({
    success: true,
    count: records.length,
    data: records
  });
});

const updateRecord = asyncHandler(async (req, res) => {
  const updatedRecord = await updateFinancialRecord(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Financial record updated successfully.",
    data: updatedRecord
  });
});

const deleteRecord = asyncHandler(async (req, res) => {
  await deleteFinancialRecord(req.params.id);

  res.status(200).json({
    success: true,
    message: "Financial record deleted successfully."
  });
});

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
