const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/health", require("./healthRoutes"));

module.exports = router;
