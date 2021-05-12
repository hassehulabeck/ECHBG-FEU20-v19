const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
    /* Dotenv behöver inte läggas i någon variabel. Istället kommer vi åt objektet process.env som i sin tur innehåller egenskaperna i .env-filen */

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const payload = {
    iss: 'zocom',
    exp: Math.floor(Date.now() / 1000) + (60 * 5),
    role: 'superuser'
}

app.post('/login', (req, res) => {
    // Kolla om inlogg är rätt.
    if (req.body.user == process.env.USER && req.body.pw == process.env.PW) {

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