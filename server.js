require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})

const db = mongoose.connection

db.on ("error", (error) => console.error(error))
db.once('open',() => console.log("Connected to DB"))

app.use(express.json())

const userRoute = require('./routes/user')
app.use('/user',userRoute)

const articleRoute = require('./routes/article')
app.use('/article',articleRoute)

app.listen(3000, () => console.log("Server Started"))