const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log non-operational errors for debugging
  if (!err.isOperational) {
    console.error('CRITICAL ERROR 💥:', err);
  }

  // Consistent response format
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message || 'Something went wrong on the server',
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

export default globalErrorHandler;
