const {
  getOverviewStats,
  getCategoryWiseTotals,
  getMonthlyTrends,
  getRecentTransactions
} = require("../services/dashboardService");

const getDashboardOverview = async (req, res, next) => {
  try {
    const overview = await getOverviewStats();

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardCategoryTotals = async (req, res, next) => {
  try {
    const categoryTotals = await getCategoryWiseTotals();

    res.status(200).json({
      success: true,
      count: categoryTotals.length,
      data: categoryTotals
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardMonthlyTrends = async (req, res, next) => {
  try {
    const monthlyTrends = await getMonthlyTrends();

    res.status(200).json({
      success: true,
      count: monthlyTrends.length,
      data: monthlyTrends
    });
  } catch (error) {
    next(error);
  }
};

const getDashboardRecentTransactions = async (req, res, next) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isNaN(parsedLimit) ? 5 : parsedLimit;

    if (limit <= 0) {
      res.status(400);
      throw new Error("Limit must be greater than 0.");
    }

    const recentTransactions = await getRecentTransactions(limit);

    res.status(200).json({
      success: true,
      count: recentTransactions.length,
      data: recentTransactions
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardOverview,
  getDashboardCategoryTotals,
  getDashboardMonthlyTrends,
  getDashboardRecentTransactions
};
