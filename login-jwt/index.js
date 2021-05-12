const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const User = require('./user')

require('dotenv').config()
    /* Dotenv behöver inte läggas i någon variabel. Istället kommer vi åt objektet process.env som i sin tur innehåller egenskaperna i .env-filen */

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Uppkoppling till db
mongoose.connect('mongodb://localhost:27017', { useUnifiedTopology: true, urlencoded: true, dbName: 'login-jwt' })

const db = mongoose.connection

db.on('error', (err) => {
    console.error(err)
})
db.once('open', () => {
    console.log("Db ansluten.")
})

const payload = {
    iss: 'zocom',
    exp: Math.floor(Date.now() / 1000) + (60 * 5),
    role: 'superuser'
}

app.post('/login', (req, res) => {

    // Hämta data & kolla om inlogg är rätt.
    const user = User.findOne({ user: req.body.user, pw: req.body.pw })

    if (user.role) {

        // I så fall, signa och skicka token.
        const token = jwt.sign(payload, process.env.SECRET)
        res.cookie('auth-token', token)
        res.json(token)
    } else {
        res.send("Dina uppgifter stämde inte.")
    }
})

// Public kan ses av alla inloggade
app.get('/public', (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {

        const token = req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                res.json(err)
            } else {
                res.send("Något trevligt för en inloggad " + payload.role)
            }
        })
    }
})

// Secret kan ses av alla inloggade som har role==admin
app.get('/secret', (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, (err, payload) => {
            if (err) {
                res.json(err)
            } else {
                if (payload.role == 'admin') {
                    res.send("Du är en admin")
                } else {
                    res.send("Vänligen gå till /public")
                }
            }
        })
    }
})

app.listen(3000, () => {
    console.log("Active @3000")
})