const express = require('express')
const app = express()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
require('dotenv').config()
app.use(cookieParser())


const User = require('./user')
const Food = require('./food')

app.use(express.urlencoded({ extended: true }))


// Koppla upp mot db
mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'burgerTown' })

const db = mongoose.connection

db.on('error', (err) => {
    console.error(err)
})
db.once('open', () => {
    console.log('Nu är db:n uppkopplad')
})


app.post('/login', async(req, res) => {

    // Hämta data & kolla om inlogg är rätt.
    const user = await User.findOne({ name: req.body.name, password: req.body.password })

    if (user) {

        const payload = {
            iss: 'zocom',
            exp: Math.floor(Date.now() / 1000) + (60 * 15), // 15 minuter
            uid: user._id
        }

        // I så fall, signa och skicka token.
        const token = jwt.sign(payload, process.env.SECRET)
        res.cookie('auth-token', token)
        res.json(token)
    } else {
        res.send("Dina uppgifter stämde inte.")
    }
})

app.get('/foods', async(req, res) => {
    const result = await Food.find({})
    res.json(result)
})

app.post('/tray', (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                res.json(err)
            } else {
                const user = await User.findById(payload.uid)
                user.tray.push(req.body.food)
                user.save()
                res.json(user.tray)
            }
        })
    }
})

app.get('/tray', (req, res) => {
    if (!req.cookies['auth-token']) {
        res.send("Bara för inloggade.")
    } else {
        const token = req.cookies['auth-token']
        jwt.verify(token, process.env.SECRET, async(err, payload) => {
            if (err) {
                res.json(err)
            } else {
                // Hämta data - även om maten och dess priser.
                const user = await User.findById(payload.uid).populate('tray')

                // Använd js inbyggda reduce-funktion för att summera priserna.
                let total = user.tray.reduce((accumulator, current) => {
                    return accumulator + current.price
                }, 0)

                // Skicka både user-documentet och total som respons. 
                res.json({ user, total })

            }
        })
    }

})

app.post('/foods', (req, res) => {
    const newFood = new Food({
        name: req.body.name,
        price: req.body.price
    })

    newFood.save((err) => {
        if (err) console.error(err)
    })
    res.json(newFood)
})




app.listen(3000, () => {
    console.log("Igång med webbservern")
})