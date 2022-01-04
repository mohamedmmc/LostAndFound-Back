const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const multer = require ('../middleware/multer-config')
const cloudinary = require("../middleware/cloudinary")

//getting all
router.get ('/', async (req,res) => {
    try {
        const article = await Article.find().populate('user').populate('question')
        if (article.length>0){
            res.json({
                    articles: article})
        }
        else{
            res.json({message:"nothing to show"})
        }
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getArticle,(req,res) => {
    res.send(res.article.nom)
})
//creating one
router.post ('/',multer,async (req,res) => {
    const photoCloudinary = await cloudinary.uploader.upload(req.file.path)

    const article = new Article({
        nom: req.body.nom,
        description: req.body.description,
        addresse: req.body.addresse,
        type: req.body.type,
        photo : photoCloudinary.url,
        user: req.body.user
    })
    try {
        const newArticle = await article.save()
        const newnewArticle = await Article.findById(newArticle.id).populate('user')
        res.status(201).json(newnewArticle)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getArticle,multer,async (req,res) => {
    if (req.body.nom != null){
        res.article.nom = req.body.nom
    }
    if (req.body.description != null){
        res.article.description = req.body.description
    }
    if (req.body.addresse != null){
        res.article.addresse = req.body.addresse
    }
    if (req.file.filename != null){
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        res.article.photo =  photoCloudinary.url
    }
    try {
        const updatedArticle = await res.article.save()
        const newnewArticle = await Article.findById(updatedArticle.id).populate('user').populate('question')
        res.json(newnewArticle)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getArticle,async (req,res) => {
    try {
        await res.article.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})
router.get ('/myArticles/:id',getArticlesByUser,async (req,res) => {
    res.json({articles:res.articles})
})

async function getArticle(req,res,next){
    let article
    try {
        article = await Article.findById(req.params.id)
        if (article == null){
            return res.status(404).json({message : "Article non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.article = article
    next()
}

async function getArticlesByUser  (req,res,next){
    let articles
    try {
        articles = await Article.find({ user: req.params.id }).populate('user').populate('question')
        if (articles == null){
            res.json({message:"sans articles"})
        }
    } catch (error) {
        res.json({message:error.message})

    }
    res.articles = articles
    next()
}
module.exports = router