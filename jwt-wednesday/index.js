const jwt = require('jsonwebtoken')
require('dotenv').config()

const payload = {
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    role: 'regular',
    iss: 'zocom'
}

const options = {
    algorithm: 'HS256'
}



let token = jwt.sign(payload, process.env.PW, options)
console.log(token)