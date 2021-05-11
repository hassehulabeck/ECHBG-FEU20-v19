const express = require('express')
const app = express()
const mongoose = require('mongoose')

const Book = require('./models/book')
const Author = require('./models/author')

// Läsa från req.body
app.use(express.urlencoded({ extended: true }))

// Koppla upp mot databas
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'library' })

// Ett "handtag" till vår uppkoppling
const db = mongoose.connection

// Fel?
db.on('error', (err) => {
    console.error(err)
})

// Starta upp db-koppling
db.once('open', () => {
    console.log('Vi har uppkoppling mot db.')
})


// Routes

app.get('/', async(req, res) => {
    const result = await Book.find({}, { _id: 0, title: 1 })
    res.json(result)
})

app.post('/', (req, res) => {
    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    author.save((err) => {
        if (err) console.error(err)

        const book = new Book({
            title: req.body.title,
            isbn: req.body.isbn,
            author: author._id
        })

        book.save((err) => {
            if (err) console.error(err)

        })
        res.json(book)
    })
})


app.listen(3000, () => {
    console.log('Webbservern är igång')
})