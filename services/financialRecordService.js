const FinancialRecord = require("../models/FinancialRecord");

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
  return FinancialRecord.create(payload);
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
  return FinancialRecord.findByIdAndUpdate(recordId, updates, {
    new: true,
    runValidators: true
  }).populate("createdBy", "name email role");
};

const deleteFinancialRecord = async (recordId) => {
  return FinancialRecord.findByIdAndDelete(recordId);
};

module.exports = {
  createFinancialRecord,
  getFinancialRecords,
  getFinancialRecordById,
  updateFinancialRecord,
  deleteFinancialRecord
};
