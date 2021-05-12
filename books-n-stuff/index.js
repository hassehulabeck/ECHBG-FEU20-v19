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

app.get('/books', async(req, res) => {
    const books = await Book.find({}).populate('author')

    let result = ""
    books.forEach((book) => {
        result += book.author[0].lastName + " skrev boken " + book.title
    })
    res.send(result)
})
app.get('/authors', async(req, res) => {
    const authors = await Author.find({}).populate('books')

    let result = ""
    authors.forEach((author) => {
        result += author.lastName + " har skrivit boken " + author.books[0].title + "<p>"
    })
    res.send(result)
})


app.get('/books/:id', async(req, res) => {
    const book = await Book.findById(req.params.id).populate('author')
        // res.send(`${book.title} (${book.isbn}) är författad av ${book.author[0].lastName}`)
    res.json(book)
})

app.get('/authors/:id', async(req, res) => {
    const author = await Author.findById(req.params.id).populate('books')
    res.send(`${author.firstName} ${author.lastName} är författare till ${author.books[0].title}`)
})


app.post('/', (req, res) => {
    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })

    const book = new Book({
        title: req.body.title,
        isbn: req.body.isbn,
        author: author._id
    })

    author.save((err) => {
        if (err) console.error(err)

        book.save((err) => {
            if (err) console.error(err)

        })
        res.json(book)
    })
    author.books.push(book._id)
})


app.listen(3000, () => {
    console.log('Webbservern är igång')
})