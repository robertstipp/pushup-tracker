const { default: mongoose } = require('mongoose')
const AppError = require('./../utils/appError')


const handleDatabaseError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'A database error occurred'
  })
}

const handleAuthenticationError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || 'You are not authorized to preform this action'
  })
}

const handleDuplicateKeyError = (err, res) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  res.status(400).json({
    status: 'fail',
    message: message
  });
}

const handleValidationError = (err, res) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. Errors: ${errors.join('. ')}`;
  res.status(400).json({
    status: 'fail',
    message: message
  });
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  } else if (process.env.NODE_ENV === 'production') {
    let error = {...err}
    error.message = err.message

    if (error.code === 11000 || error.code === 11001) {
      return handleDuplicateKeyError(error, res)
    }

    if (error instanceof mongoose.Error.ValidationError) {
      return handleValidationError(error,res)
    } else if (error.type === 'Database') {
      return handleDatabaseError(error, res)
    } else if (error.type === 'Authentication') {
      return handleAuthenticationError(error, res)
    } else {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Something went wrong!!'
      })
    }
  }
}
