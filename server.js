require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require ('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})

const db = mongoose.connection

db.on ("error", (error) => console.error(error))
db.once('open',() => console.log("Connected to DB"))

app.use(express.json())

const userRoute = require('./routes/user')
app.use('/upload',express.static(path.join(__dirname,'upload')))
app.use('/user',userRoute)

app.listen(3000, () => console.log("Server Started"))