const User = require('../model/User')
const AsyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

/**
 * DESC     Login a user
 * Route    POST /api/user/login
 * ACCESS   Public
 */
module.exports.login = AsyncHandler(async (req, res, next) => {

    const { username, password } = req.body

    if (!username || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400))
    }

    const user = await User.findOne({ username }).select('+password')
    if (!user) {
        return next(new ErrorResponse('Invalid Credentials!', 401))
    }
    const isMatch = await user.matchPasswords(password)
    if (!isMatch) {
        return next(new ErrorResponse('Invalid Credentials!', 401))
    }

    sendTokenResponse(user, 200, res)
})

/**
 * DESC     Register a user
 * Route    POST /api/user/register
 * ACCESS   Public
 */
module.exports.register = AsyncHandler(async (req, res, next) => {
    const user = await User.create(req.body)

    sendTokenResponse(user, 200, res)
})

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedjwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        })
}