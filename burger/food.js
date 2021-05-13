const mongoose = require('mongoose')

const foodSchema = mongoose.Schema({
    name: String,
    price: Number
})

const Food = mongoose.model('Food', foodSchema)

module.exports = Food