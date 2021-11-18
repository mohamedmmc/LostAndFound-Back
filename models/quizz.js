const mongoose = require('mongoose')

const quizzchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type_article: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateCreation: {
        type: String,
        required:true,
        default: Date.now

    }
    
})

module.exports = mongoose.model('quizz',quizzchema)