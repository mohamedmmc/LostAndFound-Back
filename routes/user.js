const express = require('express')
const router = express.Router()
const User = require('../models/user')

//getting all
router.get ('/', async (req,res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 
//getting one
router.get ('/:id',getUser,(req,res) => {
    res.send(res.user.nom)
})
//creating one
router.post ('/',async (req,res) => {
    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const newUser = await user.save()
        res.status(404).json(newUser)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})
//updating one
router.patch ('/:id',getUser,async (req,res) => {
    if (req.body.nom != null){
        res.user.nom = req.body.nom
    }
    if (req.body.prenom != null){
        res.user.prenom = req.body.prenom
    }
    if (req.body.email != null){
        res.user.email = req.body.email
    }
    if (req.body.password != null){
        res.user.password = req.body.password
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({message : error.message})
    }
})
//deleting one
router.delete ('/:id',getUser,async (req,res) => {
    try {
        await res.user.remove()
        res.json({message : "Supprime avec succes"})
    } catch (error) {
        res.json({message : error.message})
    }
})

async function getUser(req,res,next){
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({message : "Utilisateur non trouve"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.user = user
    next()
}
module.exports = router