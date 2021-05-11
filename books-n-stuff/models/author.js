const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author