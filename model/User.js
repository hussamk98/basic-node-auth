const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        minlength: [6, 'Username must be atleast 6 characters'],
        maxlength: [25, 'Username cannot excede 25 characters'],
        unique: [true, 'Username is taken, try another one']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password must be atleast 6 characters'],
        maxlength: [1024, 'Password cannot excede 1024 characters'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'Please enter your name']
    }
})

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.getSignedjwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE })
}
UserSchema.methods.matchPasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = new mongoose.model('User', UserSchema)