const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    user: String,
    pw: String,
    role: String
})

const User = mongoose.model('User', userSchema)

module.exports = User