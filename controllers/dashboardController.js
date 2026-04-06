const {
  getCachedDashboardSnapshot
} = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardOverview = asyncHandler(async (req, res) => {
  const dashboardSnapshot = await getCachedDashboardSnapshot(req.user.id);

  res.status(200).json({
    success: true,
    data: dashboardSnapshot.overview
  });
});

const getDashboardCategoryTotals = asyncHandler(async (req, res) => {
  const dashboardSnapshot = await getCachedDashboardSnapshot(req.user.id);
  const categoryTotals = dashboardSnapshot.categoryTotals;

  res.status(200).json({
    success: true,
    count: categoryTotals.length,
    data: categoryTotals
  });
});

const getDashboardMonthlyTrends = asyncHandler(async (req, res) => {
  const dashboardSnapshot = await getCachedDashboardSnapshot(req.user.id);
  const monthlyTrends = dashboardSnapshot.monthlyTrends;

  res.status(200).json({
    success: true,
    count: monthlyTrends.length,
    data: monthlyTrends
  });
});

const getDashboardRecentTransactions = asyncHandler(async (req, res) => {
  const parsedLimit = Number.parseInt(req.query.limit, 10);
  const limit = Number.isNaN(parsedLimit) ? 5 : parsedLimit;

  if (limit <= 0) {
    res.status(400);
    throw new Error("Limit must be greater than 0.");
  }

  const dashboardSnapshot = await getCachedDashboardSnapshot(req.user.id);
  const recentTransactions = dashboardSnapshot.recentTransactions.slice(0, limit);

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
