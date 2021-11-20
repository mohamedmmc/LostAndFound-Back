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
        unique: true,
        maxlength: 12,
        type: String
    },
    photoProfil:{
        type: String,
        required: false
    }
    
})

module.exports = mongoose.model('user',userSchema)