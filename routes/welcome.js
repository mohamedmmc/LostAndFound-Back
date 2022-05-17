const express = require('express')
const router = express.Router()

const path = require('path');


//getting all
router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../public/', 'index.html'));
})


//getting all

module.exports = router