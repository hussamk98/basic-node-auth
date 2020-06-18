const router = require('express').Router()
const { getMe } = require('../controller/profile')
const { protect } = require('../middleware/auth')

router.get('/', protect, getMe)
module.exports = router 