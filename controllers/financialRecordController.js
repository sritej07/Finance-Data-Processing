const {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecordById,
  updateFinancialRecord,
  deleteFinancialRecord
} = require("../services/financialRecordService");

const createRecord = async (req, res, next) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await createFinancialRecord({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: "Financial record created successfully.",
      data: record
    });
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { date, category, type } = req.query;
    const records = await getFinancialRecords({ date, category, type });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingRecord = await getFinancialRecordById(id);

    if (!existingRecord) {
      res.status(404);
      throw new Error("Financial record not found.");
    }

    const updatedRecord = await updateFinancialRecord(id, req.body);

    res.status(200).json({
      success: true,
      message: "Financial record updated successfully.",
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingRecord = await getFinancialRecordById(id);

    if (!existingRecord) {
      res.status(404);
      throw new Error("Financial record not found.");
    }

    await deleteFinancialRecord(id);

    res.status(200).json({
      success: true,
      message: "Financial record deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord
};
