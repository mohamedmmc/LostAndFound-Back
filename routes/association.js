const express = require('express')
const router = express.Router()
const Association = require('../models/association')
const Article = require('../models/article')
const multer = require('../middleware/multer-config')
const cloudinary = require("../middleware/cloudinary")

//getting all
router.post('/', multer, async (req, res) => {

    const user = new Association({
        ...req.body
    })



    if (req.file) {
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        user.photoProfil = photoCloudinary.url
    } else {
        user.photoProfil = "https://res.cloudinary.com/dy05x9auh/image/upload/v1648226974/athlete_lxnnu3.png"
    }
    try {

        const newUser = await user.save()
        res.status(201).json({
            user: user,
            reponse: "good"
        })
    } catch (error) {
        res.status(400).json({ reponse: error.message })
    }
})


router.post('/:id', async (req, res) => {
    try {
        const association = await Association.findById(req.params.id)
        const article = await Article.findById(req.body.articles)
        console.log(article);
        if (req.body.articles) {
            association.articles.push(req.body.articles)
            article.user = null
        }
        await article.save()
        await association.save()
        res.status(201)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router