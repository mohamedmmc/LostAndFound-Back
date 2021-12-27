const mongoose = require('mongoose')

const questionchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    reponse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reponse'
    }
    
})

module.exports = mongoose.model('question',questionchema)