const express = require('express')
const router = express.Router()
const Article = require('../models/article')
const multer = require ('../middleware/multer-config')

//getting all
router.get ('/', async (req,res) => {
    try {
        const article = await Article.find()
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
    const article = new Article({
        nom: req.body.nom,
        description: req.body.description,
        addresse: req.body.addresse,
        //photo : `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })
    try {
        const newArticle = await article.save()
        res.status(201).json(newArticle)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getArticle,async (req,res) => {
    if (req.body.nom != null){
        res.article.nom = req.body.nom
    }
    if (req.body.description != null){
        res.article.description = req.body.description
    }
    if (req.body.addresse != null){
        res.article.addresse = req.body.addresse
    }
    res.article.dateModif = Date.now
    try {
        const updatedArticle = await res.article.save()
        res.json(updatedArticle)
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
module.exports = router