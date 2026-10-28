function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}
function errorHandler(error, req, res, next) {
  console.error(error);
  const status = error.status || (error.name === 'ValidationError' ? 400 : error.code === 11000 ? 409 : 500);
  const message = error.code === 11000 ? 'That email address is already in use.' : error.message || 'Something went wrong.';
  res.status(status).json({ success: false, message });
}
module.exports = { notFound, errorHandler };
