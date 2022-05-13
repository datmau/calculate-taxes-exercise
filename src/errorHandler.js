const logger = require('./logger')

function errorHandler() {
  this.handleError = (error, req, res,) => {
    const statusCode = error.statusCode || 500
	
    logger.error({
      level: 'error',
      message: `${req?.method} ${req?.originalUrl}, "${error.message}"`,
      additionalInfo: {
        statusCode,
        tags: 'http',
        requestInfo: {message: error.message,
          body: req?.body,
          headers: req?.headers,
          stack: error.stack
        }
      }
    })
  
    return res?.status(statusCode).json({message: error.message, statusCode}) 
  }
}

// centralized error object that derives from Node’s Error
function AppError({name, httpCode, message}) {
  Error.call(this)
  Error.captureStackTrace(this)
  this.name = name
  this.httpCode = httpCode
  this.message = message
}

AppError.prototype = Object.create(Error.prototype)
AppError.prototype.constructor = AppError

const handler = new errorHandler()
module.exports = { AppError, errorHandler: handler }