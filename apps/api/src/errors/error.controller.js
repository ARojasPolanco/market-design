import { matchError } from './errorMatchers.js';

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('💥 Unexpected error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const globalErrorHandler = (err, _req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const matched = matchError(err);
  if (matched) {
    err = matched;
  }

  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else {
    sendProdError(err, res);
  }
};
