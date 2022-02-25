
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
        },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        }]
});

module.exports = mongoose.model('Report', reportSchema);