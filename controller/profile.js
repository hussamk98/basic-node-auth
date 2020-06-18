const asyncHandler = require('../middleware/async')
const User = require('../model/User')

/**
 * DESC     GET info of logged-in user
 * Route    POST /api/user/me
 * ACCESS   Private
 */
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    res.status(200).json({
        success: true,
        data: user
    })
})