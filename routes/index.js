const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));
router.use("/records", require("./financialRecordRoutes"));
router.use("/health", require("./healthRoutes"));

module.exports = router;
