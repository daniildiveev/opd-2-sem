const express = require('express')
const path = require('path')
const app = express()

app.use(express.static('front-end'))
app.use(express.json())

const PORT = 3000;  

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'front-end/MenuPageDraft.html'))
})

app.get('/characteristics', function (req, res) {
    res.sendFile(path.join(__dirname, 'front-end/SecondPage.html'))
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'front-end/LoginPage.html'))
})

app.post('/login', function (req, res) {
    console.log(req.body)
})

app.listen(PORT)