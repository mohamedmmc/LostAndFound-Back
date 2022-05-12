const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const multer = require('../middleware/multer-config')
const cloudinary = require("../middleware/cloudinary")
const Question = require('../models/question')

//getting all
router.get('/', async (req, res) => {
    let articleAA = []
    try {
        const article = await Article.find().populate('user').populate('question')
        if (article.length > 0) {
            for (i = 0; i < article.length; i++){
                if (article[i].user != null) {
                    articleAA.push(article[i])
                }
            }
            res.status(200).json({
                articles: articleAA
            })
        }
        else {
            res.status(201).json({ message: "nothing to show" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
//getting one
router.get('/:id', getArticle, (req, res) => {
    res.send(res.article.nom)
})
//creating one
router.post('/', multer, async (req, res) => {
    const photoCloudinary = await cloudinary.uploader.upload(req.file.path)

    const article = new Article({
        nom: req.body.nom,
        description: req.body.description,
        addresse: req.body.addresse,
        type: req.body.type,
        photo: photoCloudinary.url,
        user: req.body.user
    })

    if (req.body.addresse == null) {
        console.log("req body pass empty");
        if (req.body.lat != null) {

            article.addresse.push(req.body.lat)
            article.addresse.push(req.body.long)
            console.log(article.addresse);
        }
    } else {
        let latlong = []
        latlong.push(req.body.addresse[0])
        latlong.push(req.body.addresse[1])
        console.log("hedhi requette jeya : " + latlong);
        article.article = latlong
        console.log("hedha article addresse : " + article.addresse);
    }
    try {
        const newArticle = await article.save()
        const newnewArticle = await Article.findById(newArticle.id).populate('user')
        res.status(201).json(newnewArticle)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
//updating one
router.patch('/:id', getArticle, multer, async (req, res) => {
    if (req.body.nom != null) {
        res.article.nom = req.body.nom
    }
    if (req.body.description != null) {
        res.article.description = req.body.description
    }
    console.log(req.body.addresse);
    if (req.body.addresse != null) {
        res.article.addresse = req.body.addresse
    }
    if (req.file != null) {
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        res.article.photo = photoCloudinary.url
    }
    try {
        const updatedArticle = await res.article.save()
        const newnewArticle = await Article.findById(updatedArticle.id).populate('user').populate('question')
        res.json(newnewArticle)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})
//deleting one
router.delete('/:id', getArticle, async (req, res) => {
    try {
        const question = await Question.find({ article: res.article.id }).populate('reponse')
        for (i = 0; i < question.length; i++) {
            for (j = 0; j < question[i].reponse.length; j++){
                question[i].reponse[j].remove()
            }
            question[i].remove()

        }
        await res.article.remove()
        res.json({ message: "Supprime avec succes" })
    } catch (error) {
        res.json({ message: error.message })
    }
})
router.get('/myArticles/:id', getArticlesByUser, async (req, res) => {
    let articlesAA = []
    if (res.articles.length > 0) {
        for (i = 0; i < res.articles.length; i++) {
            if (res.articles[i].user != null) {
                articlesAA.push(res.articles[i])
            }
        }
        res.status(200).json({
            articles: articlesAA
        })
    }
    res.json({ articles: res.articles })
})

async function getArticle(req, res, next) {
    let article
    try {
        article = await Article.findById(req.params.id)
        if (article == null) {
            return res.status(404).json({ message: "Article non trouve" })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
    res.article = article
    next()
}

async function getArticlesByUser(req, res, next) {
    let articles
    try {
        articles = await Article.find({ user: req.params.id }).populate('user').populate('question')
        if (articles == null) {
            res.json({ message: "sans articles" })
        }
    } catch (error) {
        res.json({ message: error.message })

    }
    res.articles = articles
    next()
}
module.exports = router