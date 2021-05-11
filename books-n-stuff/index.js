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

app.get('/books', (req, res) => {
    Book.find({})
        .populate('author')
        .exec(function(err, books) {
            if (err) console.error(err)

            let result = ""
                // .find() returnerar en array, därför forEach
            books.forEach(book => {
                result += book.author[0].lastName + " skrev " + book.title
            })
            res.send(result)
        })
})

app.get('/authors', async(req, res) => {
    const result = await Author.find({})
        .populate('book')
        .exec(function(err, author) {
            if (err) console.error(err)

            res.json(author)
        })
})


app.post('/', (req, res) => {

    // Skapa först ett objekt av vardera typ (bok och författare)

    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })

    const book = new Book({
        title: req.body.title,
        isbn: req.body.isbn,
        author: author._id
    })

    // Spara därefter författaren. 
    author.save((err) => {
        if (err) console.error(err)

        // När detta är gjort kan du spara boken.
        book.save((err) => {
            if (err) console.error(err)

        })
        res.json(book)
    })

    // Avsluta med att "uppdatera" värdet på books i author-objektet. 
    author.books.push(book)

})


app.listen(3000, () => {
    console.log('Webbservern är igång')
})