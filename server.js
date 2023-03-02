const express = require('express')
const path = require('path')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.static('front-end'))
app.use(express.json())

const PORT = 3000;  

users = []

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'front-end/MenuPageDraft.html'))
})

app.get('/characteristics', function (req, res) {
    res.sendFile(path.join(__dirname, 'front-end/SecondPage.html'))
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'front-end/LoginPage.html'))
})

app.post('/login/register', async function (req, res) {
    username = req.body["login"]
    password = req.body["password"]

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)
    const user = {user:username, password:hashedPassword}
    users.push(user)

})

app.listen(PORT)