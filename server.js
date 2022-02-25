require("dotenv").config()

const express = require ('express' )
const app = express()
const mongoose = require ("mongoose")
const path = require('path')

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true})
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require("body-parser");
/////////////////swagger

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'Lost And Found Application',
        version: 'V1.0',
        description: 'Une application pour trouver vos object perdu ou trouvé',
    },
    host: 'lost-and-found-back.herokuapp.com',
    basePath: '/',
};
// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['./swag.yml'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/swagger.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

/////////////////fin swagger
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


const reportRoute = require('./routes/report')
app.use('/report',reportRoute)

const articleRoute = require('./routes/article')
app.use('/article',articleRoute)

const reponseRoute = require('./routes/reponse')
app.use('/reponse',reponseRoute)

const questionRoute = require('./routes/question')
app.use('/question',questionRoute)


const donationRoute = require('./routes/donation')
app.use('/donation',donationRoute)
//*************************   swag */
