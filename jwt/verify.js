const jwt = require('jsonwebtoken')

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjA3NjI5MDYsIm5hbWUiOiJIYW5zIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjIwNzYyMDA2fQ.npHZLCdMVK29ZD3OlKlsFEMMid1VcTm-sXr9N28JyKg"


const key = 'f8uq98fh4fah484hreigregaehrgreauhregirehgreguha9eh54hg4huhrgirhgi'

const options = {
    algorithm: 'HS256'
}



// Hårdkodad signering
let decoded = jwt.verify(token, key, options)


console.log(decoded)