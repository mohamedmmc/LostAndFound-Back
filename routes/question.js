const express = require('express')
const router = express.Router()
const Question = require('../models/question')
const Article = require('../models/article')

//getting all
router.get ('/', async (req,res) => {
    try {
        const question = await Question.find()
        res.json(question)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getquestion,(req,res) => {
    res.send(res.question.titre)
})
//creating a question with article id
router.post ('/',async (req,res) => {

    const question = new Question({
        titre: req.body.titre,
        article: req.body.article
    })
    try {
        const newquestion = await question.save()
        const articleWithQuestion = await Article.findById(newquestion.article)
        articleWithQuestion.question = newquestion.id
        const test = await articleWithQuestion.save()
        res.status(201).json({articleConcerne:test})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
    
})
//updating one
router.patch ('/:id',getquestion,async (req,res) => {
    if (req.body.nom != null){
        res.question.nom = req.body.nom
    }
    if (req.body.type_question != null){
        res.question.type_question = req.body.type_question
    }
    if (req.body.description != null){
        res.question.description = req.body.description
    }
    res.question.dateCreation = Date.now
    try {
        const updatedquestion = await res.question.save()
        res.json(updatedquestion)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getquestion,async (req,res) => {
    try {
        await res.question.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})

async function getquestion(req,res,next){
    let question
    try {
        question = await Question.findById(req.params.id)
        if (question == null){
            return res.status(404).json({message : "question non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.question = question
    next()
}
module.exports = router