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
    },
    type:{
        type:String,
        required:true
    },
    photo:String,
    dateCreation: {
        type: String,
        required:true,
        default: Date.now
    },
    dateModif: {
        type: String,
        required:true,
        default: Date.now
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
})

module.exports = mongoose.model('article',Articlechema)