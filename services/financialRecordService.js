const FinancialRecord = require("../models/FinancialRecord");
const AppError = require("../utils/appError");
const { invalidateDashboardCache } = require("./cacheService");

const buildRecordFilters = ({ date, category, type }) => {
  const filters = {};

  if (type) {
    filters.type = type;
  }

  if (category) {
    filters.category = category;
  }

  if (date) {
    const parsedDate = new Date(date);

    if (!Number.isNaN(parsedDate.getTime())) {
      const nextDate = new Date(parsedDate);
      nextDate.setDate(nextDate.getDate() + 1);

      filters.date = {
        $gte: parsedDate,
        $lt: nextDate
      };
    }
  }

  return filters;
};

const createFinancialRecord = async (payload) => {
  const record = await FinancialRecord.create(payload);
  await invalidateDashboardCache();
  return record;
};

const getFinancialRecords = async (queryParams) => {
  const filters = buildRecordFilters(queryParams);

  return FinancialRecord.find(filters)
    .populate("createdBy", "name email role")
    .sort({ date: -1, createdAt: -1 });
};

const getFinancialRecordById = async (recordId) => {
  return FinancialRecord.findById(recordId);
};

const updateFinancialRecord = async (recordId, updates) => {
  const updatedRecord = await FinancialRecord.findByIdAndUpdate(recordId, updates, {
    new: true,
    runValidators: true
  }).populate("createdBy", "name email role");

  if (!updatedRecord) {
    throw new AppError("Financial record not found.", 404);
  }

  await invalidateDashboardCache();
  return updatedRecord;
};

const deleteFinancialRecord = async (recordId) => {
  const deletedRecord = await FinancialRecord.findByIdAndDelete(recordId);

  if (!deletedRecord) {
    throw new AppError("Financial record not found.", 404);
  }

  await invalidateDashboardCache();
  return deletedRecord;
};

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecordById,
  updateFinancialRecord,
  deleteFinancialRecord
};
