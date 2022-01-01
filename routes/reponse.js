const express = require('express')
const router = express.Router()
const reponse = require('../models/reponse')
const multer = require ('../middleware/multer-config')
const cloudinary = require("../middleware/cloudinary")
const Reponse = require('../models/reponse')
const Question = require('../models/question')
const Article = require('../models/article')
//getting all
router.get ('/:id', async (req,res) => {
    try {
        var tableau = []
        var test 
        const reponses = await Question.findOne({article:req.params.id}).populate('reponse')

        for (i=0; i<reponses.reponse.length;i++){
            test = await Reponse.findById(reponses.reponse[i].id).populate('user')
            tableau.push(test)
        }
        res.json({reponses:tableau})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 


//getting one
router.get ('/:id',getreponse,(req,res) => {
    res.send(res.reponse.nom)
})
//creating one
router.post ('/:id',getQuestion,async (req,res) => {
    const reponse = new Reponse({
        description: req.body.description,
        user: req.body.user
        })
    try {
        const newReponse = await reponse.save()
        res.question["reponse"].push(reponse) 

        const updatedQuestion = new Question(
            res.question
        )
        const nezupdatedQuestion = await updatedQuestion.save()

        res.json({question:nezupdatedQuestion})
    

    } catch (error) {
        res.status(400).json({message: error.message})
    }
})


async function getQuestion (req,res,next){
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
//updating one
router.patch ('/:id',getreponse,multer,async (req,res) => {
    if (req.body.nom != null){
        res.reponse.nom = req.body.nom
    }
    if (req.body.description != null){
        res.reponse.description = req.body.description
    }
    if (req.body.addresse != null){
        res.reponse.addresse = req.body.addresse
    }
    if (req.file.filename != null){
        const photoCloudinary = await cloudinary.uploader.upload(req.file.path)
        res.reponse.photo =  photoCloudinary.url
    }
    try {
        const updatedreponse = await res.reponse.save()
        const newnewreponse = await reponse.findById(updatedreponse.id).populate('user')
        res.json(newnewreponse)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getreponse,async (req,res) => {
    try {
        await res.reponse.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})


async function getreponse(req,res,next){
    let reponse
    try {
        reponse = await reponse.findById(req.params.id)
        if (reponse == null){
            return res.status(404).json({message : "reponse non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.reponse = reponse
    next()
}

module.exports = router