const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String
    },
    prenom: {
        type: String
    },
    email: {
        required:true,
        type: String,
        match: /.+\@.+\..+/,
        unique: true
    },
    password: {
        type: String
    },
    numt:{
        required:false,
        maxlength: 12,
        type: String
    },
    photoProfil:{
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean, default: false
    }
    
})

module.exports = mongoose.model('user',userSchema)