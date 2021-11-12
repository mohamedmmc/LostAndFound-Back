const mongoose = require('mongoose')

const Articlechema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    addresse: {
        type: String,
        required: true
    },
    dateCreation: {
        type: String,
        required:true,
        default: Date.now
    },
    dateModif: {
        type: String,
        required:true,
        default: Date.now
    }
    
})

module.exports = mongoose.model('article',Articlechema)