const express = require("express");

const router = express.Router();

router.use("/health", require("./healthRoutes"));

module.exports = router;
