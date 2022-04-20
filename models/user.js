const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nom: {
        type: String
    },
    prenom: {
        type: String
    },
    email: {
        unique: true,
        required: true,
        type: String,
        match: /.+\@.+\..+/

    },
    password: {
        type: String
    },
    numt: {
        required: false,
        maxlength: 12,
        type: String
    },
    photoProfil: {
        type: String,
        required: false
    },
    isVerified: {
        type: Boolean, default: false
    },
    tokenfb: {
        type: String
    }/*,
    ratings:{
        type: mongoose.Mixed, 
        1: Number, 
        2: Number,
        3: Number,
        4: Number,
        5: Number,
    default: {1:1, 2:1, 3:1, 4:1, 5:1}}*/

})

module.exports = mongoose.model('user', userSchema)