import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

type ValidationErrors = Record<string, string[]>

const errorHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error)

  if (error instanceof ValidationError) {
    let errors: ValidationErrors = {}

    error.inner.forEach(err => {
      !!err.path && (errors[err.path] = err.errors)
    })

    return response.status(400).json({
      message: 'Validation failed',
      errors
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'Invalid token',
    })
  }

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'Invalid id',
    })
  }

  if (error.name === 'MongoError') {
    return response.status(400).json({
      error: error.message,
    })
  }

  return response.status(500).json({
    error: 'Internal server error',
  })
}

export default errorHandler