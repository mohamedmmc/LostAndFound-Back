const express = require('express')
const router = express.Router()
const Charity = require('../models/charity')

//getting all
router.get ('/', async (req,res) => {
    try {
        const charity = await Charity.find()
        res.json(charity)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getCharity,(req,res) => {
    res.send(res.charity.nom)
})
//creating one
router.post ('/',async (req,res) => {
    const charity = new Charity({
        nom: req.body.nom,
        type_charity: req.body.type_charity,
        description: req.body.description,
        dateCreation: req.body.dateCreation,
    })
    try {
        const newCharity = await charity.save()
        res.status(201).json(newCharity)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getCharity,async (req,res) => {
    if (req.body.nom != null){
        res.charity.nom = req.body.nom
    }
    if (req.body.type_charity != null){
        res.charity.type_charity = req.body.type_charity
    }
    if (req.body.description != null){
        res.charity.description = req.body.description
    }
    res.charity.dateCreation = Date.now
    try {
        const updatedCharity = await res.charity.save()
        res.json(updatedCharity)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getCharity,async (req,res) => {
    try {
        await res.charity.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})

async function getCharity(req,res,next){
    let charity
    try {
        charity = await Charity.findById(req.params.id)
        if (charity == null){
            return res.status(404).json({message : "Charity non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.charity = charity
    next()
}
module.exports = router