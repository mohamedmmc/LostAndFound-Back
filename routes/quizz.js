const express = require('express')
const router = express.Router()
const Article = require('../models/quizz')
const Quizz = require('../models/quizz')
const Question = require ('../models/question')

//getting all
router.get ('/', async (req,res) => {
    try {
        const quizz = await Quizz.find().populate('article')
        res.json(quizz)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getQuizz,(req,res) => {
    res.send(res.quizz)
})
//creating one
router.post ('/',async (req,res) => {
    
    const quizz = new Quizz({
        article: req.body.article,
        question: req.body.question
    })
    try {
        const newQuizz = await quizz.save()
        res.status(201).json(newQuizz)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getQuizz,async (req,res) => {
    if (req.body.nom != null){
        res.quizz.nom = req.body.nom
    }
    if (req.body.type_article != null){
        res.quizz.type_article = req.body.type_article
    }
    if (req.body.description != null){
        res.quizz.description = req.body.description
    }
    res.quizz.dateCreation = Date.now
    try {
        const updatedQuizz = await res.quizz.save()
        res.json(updatedQuizz)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getQuizz,async (req,res) => {
    try {
        await res.quizz.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})

async function getQuizz(req,res,next){
    let quizz
    try {
        quizz = await Quizz.findById(req.params.id)
        if (quizz == null){
            return res.status(404).json({message : "Quizz non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.quizz = quizz
    next()
}
module.exports = router