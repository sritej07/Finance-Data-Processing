const express = require("express");
const {
  getDashboardOverview,
  getDashboardCategoryTotals,
  getDashboardMonthlyTrends,
  getDashboardRecentTransactions
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeAccess } = require("../middleware/rbacMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeAccess("dashboard"));

router.get("/overview", getDashboardOverview);
router.get("/category-totals", getDashboardCategoryTotals);
router.get("/monthly-trends", getDashboardMonthlyTrends);
router.get("/recent-transactions", getDashboardRecentTransactions);

module.exports = router;
