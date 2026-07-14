const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || res.statusCode;

  res.status(statusCode !== 200 ? statusCode : 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
};

module.exports = {
  errorHandler,
  notFound,
};
