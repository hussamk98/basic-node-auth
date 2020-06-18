const ErrorResponse = require('../utils/errorResponse')

const error = (err, req, res, next) => {
    let error = { ...err }
    error.message = err.message

    console.log(err)

    if (err.name === 'CastError') {
        const message = `Resource not found with id ${err.value}`
        error = new ErrorResponse(message, 404)
    }
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message)
        error = new ErrorResponse(message, 400)
    }
    //duplicate value found
    if (err.code === 11000) {
        const message = `Username already taken, use another one instead`
        error = new ErrorResponse(message, 400)
    }

    res.status(error.statusCode || 500)
        .json({
            success: false,
            error: error.message || 'Server Error'
        })
}
module.exports = error