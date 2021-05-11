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



app.listen(3000, () => {
    console.log('Webbservern är igång')
})