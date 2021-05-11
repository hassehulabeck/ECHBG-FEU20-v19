const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    regnr: {
        type: String,
        match: /^[A-Z]{3}\d{3}$/,
    },
    price: {
        type: Number,
        validate: {
            validator: function(v) {
                // Priset ska vara jämnt delbart med 10, annars får det vara. 
                return v % 10 == 0
            }
        }
    },
    isbn: {
        type: String,
        minLength: 13,
        maxLength: [17, 'Inte mer än 17 tecken']
    },
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }]
})

const Book = mongoose.model('Book', bookSchema)

module.exports = Book