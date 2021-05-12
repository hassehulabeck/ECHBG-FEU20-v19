const jwt = require('jsonwebtoken')
require('dotenv').config()
const app = require('express')()

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjA4MTYxOTEsInJvbGUiOiJyZWd1bGFyIiwiaXNzIjoiem9jb20iLCJpYXQiOjE2MjA4MTI1OTF9.ZeNaWG_3cjx2-CX8Rd7SJb1F9hFo4EPi0OHQtEAQbDw"


const options = {
    algorithm: 'HS256'
}

app.get('/', (req, res) => {

    jwt.verify(token, process.env.PW, options, (err, payload) => {
        if (err) {
            res.send(err)
        } else {
            if (payload.role == 'admin') {
                res.send("OK")
            } else {
                res.send("Nope")
            }
        }
    })

})




app.listen(3000, () => {
    console.log("Active")
})