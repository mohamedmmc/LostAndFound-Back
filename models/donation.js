const mongoose = require('mongoose')

const Donationchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    valeur: {
        type: Number,
        required: true
    }
    
})

module.exports = mongoose.model('donation',Donationchema)