const mongoose = require('mongoose')

const questionchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type_question: {
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

module.exports = mongoose.model('question',questionchema)