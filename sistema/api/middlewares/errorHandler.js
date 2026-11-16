const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.status || 500;

  if (status >= 500) {
    console.error('[api]', error);
  }

  return res.status(status).json({
    message: status >= 500 ? 'Ocurrió un error inesperado en el servidor.' : error.message,
  });
};

module.exports = errorHandler;
