require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require("body-parser"),

 swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from JSONPlaceholder.',
    license: {
      name: 'Licensed Under MIT',
      url: 'https://spdx.org/licenses/MIT.html',
    },
    contact: {
      name: 'JSONPlaceholder',
      url: 'https://jsonplaceholder.typicode.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, () => console.log("Server Started"));
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

const questionRoute = require('./routes/question')
app.use('/question',questionRoute)

const donationRoute = require('./routes/donation')
app.use('/donation',donationRoute)
//*************************   swag */
