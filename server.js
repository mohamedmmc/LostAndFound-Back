require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})

const db = mongoose.connection

db.on ("error", (error) => console.error(error))
db.once('open',() => console.log("Connected to DB"))

app.use(express.json())

app.use('/upload',express.static(path.join(__dirname,'upload')))

const userRoute = require('./routes/user')
app.use('/user',userRoute)

const articleRoute = require('./routes/article')
app.use('/article',articleRoute)

const quizzRoute = require('./routes/quizz')
app.use('/quizz',quizzRoute)

const charityRoute = require('./routes/charity')
app.use('/charity',charityRoute)

const donationRoute = require('./routes/donation')
app.use('/donation',donationRoute)

app.listen(3000, () => console.log("Server Started"))