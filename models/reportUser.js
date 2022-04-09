
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    userReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        },
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        }]
});

module.exports = mongoose.model('userReport', reportSchema);