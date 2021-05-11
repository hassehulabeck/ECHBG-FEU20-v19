const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: String,
    isbn: String,
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }]
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book