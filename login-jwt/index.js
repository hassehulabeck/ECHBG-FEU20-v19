const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
require('dotenv').config()
    /* Dotenv behöver inte läggas i någon variabel. Istället kommer vi åt objektet process.env */




app.listen(3000, () => {
    console.log("Active @3000")
})