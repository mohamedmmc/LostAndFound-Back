const express = require('express')
const router = express.Router()
const Donation = require('../models/donation')

//getting all
router.get ('/', async (req,res) => {
    try {
        const donation = await Donation.find()
        res.json(donation)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getDonation,(req,res) => {
    res.send(res.donation.nom)
})
//creating one
router.post ('/',async (req,res) => {
    const donation = new Donation({
        type: req.body.type,
        valeur: req.body.valeur,
    })
    try {
        const newDonation = await donation.save()
        res.status(201).json(newDonation)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getDonation,async (req,res) => {
    if (req.body.type != null){
        res.donation.type = req.body.type
    }
    if (req.body.valeur != null){
        res.donation.valeur = req.body.valeur
    }
})
//deleting one
router.delete ('/:id',getDonation,async (req,res) => {
    try {
        await res.donation.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})

async function getDonation(req,res,next){
    let donation
    try {
        donation = await Donation.findById(req.params.id)
        if (donation == null){
            return res.status(404).json({message : "Donation non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.donation = donation
    next()
}
module.exports = router