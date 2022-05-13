const express = require('express')
const router = express.Router()
const Association = require('../models/association')
const Article = require('../models/article')
const User = require('../models/user')
const multer = require('../middleware/multer-config')
const cloudinary = require("../middleware/cloudinary")

//getting all
router.post('/', multer, async (req, res) => {

    const user = new Association({
        ...req.body
    })



    if (req.file) {
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        user.photo = photoCloudinary.url
    } else {
        user.photo = "https://res.cloudinary.com/dy05x9auh/image/upload/v1648226974/athlete_lxnnu3.png"
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


//getting all
router.get('/', async (req, res) => {
    const associations = await Association.find()
    return res.status(200).json({ association: associations })
})

router.post('/:id', async (req, res) => {
    try {
        const association = await Association.findById(req.params.id)
        const article = await Article.findById(req.body.article)
        if (req.body.article) {
            if (association.articles.length > 0) {
                if (!association.articles.includes(req.body.article)) {
                    article.association = association._id
                    association.articles.push(req.body.article)
                } else {
                    return res.status(400).json('duplicate')
                }
            } else {
                article.association = association._id
                association.articles.push(req.body.article)
            }
        }
        await article.save()
        await association.save()
        return res.status(201).json("ok")
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

router.patch('/participation/:id', async (req, res) => {
    console.log(req.body);
    let articles = []
    try {
        const association = await Association.findById(req.params.id).populate({
            path: 'articles',
            populate: { path: 'user' }
        })

        const user = await User.findById(req.body._id)
        if (req.body._id) {
            if (association.articles.length > 0) {
                for (i = 0; i < association.articles.length; i++) {
                    if (association.articles[i].user.id == req.body._id) {
                        articles.push(association.articles[i])
                    }
                }
            }
        }
        return res.status(201).json({ articles })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

module.exports = router