const mongoose = require('mongoose')

const reponsehema = new mongoose.Schema({
    description: {
        type:String,
        required:true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
    
})

module.exports = mongoose.model('reponse',reponsehema)