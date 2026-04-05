const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal server error.";
  let errors;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed.";
    errors = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message
    }));
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}.`;
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this value already exists.";
    errors = Object.keys(err.keyValue || {}).map((field) => ({
      field,
      message: `${field} must be unique.`
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {})
  });
};

module.exports = {
  errorHandler
};
