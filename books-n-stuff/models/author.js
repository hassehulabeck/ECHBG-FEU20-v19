const mongoose = require('mongoose')

const authorSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    firstName: String,
    lastName: String,
})

const Author = mongoose.model('Author', authorSchema)

module.exports = Author