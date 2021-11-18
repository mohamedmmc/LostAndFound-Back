const mongoose = require('mongoose')

const Charitychema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    type_charity: {
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

module.exports = mongoose.model('charity',Charitychema)