const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    password: String,
    tray: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Food'
    }]
})

const User = mongoose.model('User', userSchema)

module.exports = User