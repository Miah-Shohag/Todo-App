const errorHandlers = (err, req, res, next) => {
  const statusCode = req.status || 500;
  const message = err.message || "Ïnternal server error";

  console.error(err.stack);
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorHandlers;
