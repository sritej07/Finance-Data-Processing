const {
  getOverviewStats,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentTransactions
} = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardOverview = asyncHandler(async (req, res) => {
  const overview = await getOverviewStats();

  res.status(200).json({
    success: true,
    data: overview
  });
});

const getDashboardCategoryTotals = asyncHandler(async (req, res) => {
  const categoryTotals = await getCategoryWiseTotals();

  res.status(200).json({
    success: true,
    count: categoryTotals.length,
    data: categoryTotals
  });
});

const getDashboardMonthlyTrends = asyncHandler(async (req, res) => {
  const monthlyTrends = await getMonthlyTrends();

  res.status(200).json({
    success: true,
    count: monthlyTrends.length,
    data: monthlyTrends
  });
});

const getDashboardRecentTransactions = asyncHandler(async (req, res) => {
  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isNaN(parsedLimit) ? 5 : parsedLimit;
  const recentTransactions = await getRecentTransactions(limit);

  res.status(200).json({
    success: true,
    count: recentTransactions.length,
    data: recentTransactions
  });
});

module.exports = {
  getDashboardOverview,
  getDashboardCategoryTotals,
  getDashboardMonthlyTrends,
  getDashboardRecentTransactions
};
