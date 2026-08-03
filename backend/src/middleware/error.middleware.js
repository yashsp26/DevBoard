const errorMiddleware = (err, req, res, next) => {
  console.error({
    message: err.message,
    stack: err.stack,
    status: err.statusCode,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || null,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,
  });
};

export default errorMiddleware;