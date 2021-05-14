const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    role: String
})

const User = mongoose.model('User', userSchema)

module.exports = User