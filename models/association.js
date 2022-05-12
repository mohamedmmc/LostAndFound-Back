const mongoose = require('mongoose')

const AssociationSchema = new mongoose.Schema({
    nom: String,
    photo: String,
    numTel: String,
    articles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    }],
    categorie: String,
})

module.exports = mongoose.model('association', AssociationSchema)