const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required:true
    },
    numt:{
        type: String,
        required: true
    },
    photoProfil:{
        type: String,
        required: true
    }
    
})

module.exports = mongoose.model('user',userSchema)