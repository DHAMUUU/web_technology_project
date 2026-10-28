function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  console.error(error.message || error);
  const status = error.status || (error.name === 'ValidationError' ? 400 : error.code === 11000 ? 409 : ['JsonWebTokenError','TokenExpiredError','CastError'].includes(error.name) ? 401 : error.message === 'Origin is not allowed by CORS' ? 403 : 500);
  const message = error.code === 11000 ? 'That email address is already in use.' : status === 500 ? 'Something went wrong.' : error.message || 'Something went wrong.';
  res.status(status).json({ success: false, message });
}
module.exports = { notFound, errorHandler };
