const FinancialRecord = require("../models/FinancialRecord");
const AppError = require("../utils/appError");
const { getDashboardCache, setDashboardCache } = require("./cacheService");

const getOverviewStats = async () => {
  const [result] = await FinancialRecord.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] }
      }
    }
  ]);

  return (
    result || {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0
    }
  );
};

const getCategoryWiseTotals = async () => {
  return FinancialRecord.aggregate([
    {
      $group: {
        _id: {
          category: "$category",
          type: "$type"
        },
        totalAmount: { $sum: "$amount" },
        transactionCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id.category",
        type: "$_id.type",
        totalAmount: 1,
        transactionCount: 1
      }
    },
    {
      $sort: {
        totalAmount: -1,
        category: 1
      }
    }
  ]);
};

const getMonthlyTrends = async () => {
  return FinancialRecord.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" }
        },
        totalIncome: {
          $sum: {
            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
          }
        },
        totalExpenses: {
          $sum: {
            $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalIncome: 1,
        totalExpenses: 1,
        netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] }
      }
    },
    {
      $sort: {
        year: 1,
        month: 1
      }
    }
  ]);
};

const getRecentTransactions = async (limit = 5) => {
  if (limit <= 0) {
    throw new AppError("Limit must be greater than 0.", 400);
  }

  return FinancialRecord.aggregate([
    {
      $sort: {
        date: -1,
        createdAt: -1
      }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy"
      }
    },
    {
      $unwind: {
        path: "$createdBy",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        amount: 1,
        type: 1,
        category: 1,
        date: 1,
        notes: 1,
        createdAt: 1,
        createdBy: {
          _id: "$createdBy._id",
          name: "$createdBy.name",
          email: "$createdBy.email",
          role: "$createdBy.role"
        }
      }
    }
  ]);
};

const buildDashboardSnapshot = async () => {
  const [overview, categoryTotals, monthlyTrends, recentTransactions] = await Promise.all([
    getOverviewStats(),
    getCategoryWiseTotals(),
    getMonthlyTrends(),
    getRecentTransactions(20)
  ]);

  return {
    overview,
    categoryTotals,
    monthlyTrends,
    recentTransactions
  };
};

const getCachedDashboardSnapshot = async (userId) => {
  const cachedSnapshot = await getDashboardCache(userId);

  if (cachedSnapshot) {
    return cachedSnapshot;
  }

  const snapshot = await buildDashboardSnapshot();
  await setDashboardCache(userId, snapshot);

  return snapshot;
};

module.exports = {
  getOverviewStats,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentTransactions,
  getCachedDashboardSnapshot
};
