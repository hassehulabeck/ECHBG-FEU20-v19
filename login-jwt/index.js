const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const User = require('./user')
const bcrypt = require('bcrypt')
const saltRounds = 10

require('dotenv').config()
    /* Dotenv behöver inte läggas i någon variabel. Istället kommer vi åt objektet process.env som i sin tur innehåller egenskaperna i .env-filen */

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Uppkoppling till db
mongoose.connect('mongodb://localhost:27017', { useUnifiedTopology: true, useNewUrlParser: true, dbName: 'login-jwt' })

const db = mongoose.connection

db.on('error', (err) => {
    console.error(err)
})
db.once('open', () => {
    console.log("Db ansluten.")
})


// Registrera användare
app.post('/register', (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) res.json(err)
        else {
            const newUser = new User({
                username: req.body.username,
                password: hash,
                role: 'regular'
            })

            newUser.save((err) => {
                if (err) res.json(err)
                else {
                    res.json(newUser)
                }
            })
        }

    })

})


app.post('/login', async(req, res) => {

    // Hämta data för den användare som har det namn som skrivits in
    const user = await User.findOne({ username: req.body.username })

    if (user) {
        // Kolla om lösenordet stämmer. 
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) res.json(err)

            if (result !== false) {
                console.log(result)
                const payload = {
                    iss: 'zocom',
                    exp: Math.floor(Date.now() / 1000) + (60 * 5),
                    role: user.role
                }

                // I så fall, signa och skicka token.
                const token = jwt.sign(payload, process.env.SECRET)
                res.cookie('auth-token', token)
                res.send("Välkommen " + user.username)

            } else {
                res.send("Dina credentials stämde inte")
            }
        })

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