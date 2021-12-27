const mongoose = require('mongoose')

const quizzchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'question'
    }
    
})

module.exports = mongoose.model('quizz',quizzchema)