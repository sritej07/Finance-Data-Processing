const express = require("express");
const { notFound } = require("./middleware/notFoundMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zorvyn Finance API is running."
  });
});

app.use("/api", require("./routes"));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
