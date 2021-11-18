const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('../Middleware/multer-config')

//getting all
router.get ('/', async (req,res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.status(500).json({reponse: error.message})
    }
}) 
//getting one
router.get ('/:id',authentificateToken,getUserById,(req,res) => {
    res.json(res.user)
})
//creating one
router.post ('/',multer,async (req,res) => {
    const hashedPass = await Bcrypt.hash(req.body.password,10)
    console.log(`${req.protocol}://${req.get('host')}/upload/${req.file.filename}`)
    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hashedPass,
        numt: req.body.numt,
        photoProfil: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })
    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
})
//updating one
router.patch ('/:id',getUserById,async (req,res) => {
    if (req.body.nom != null){
        res.user.nom = req.body.nom
    }
    if (req.body.prenom != null){
        res.user.prenom = req.body.prenom
    }
    if (req.body.email != null){
        res.user.email = req.body.email
    }
    if (req.body.numt != null){
        res.user.numt = req.body.numt
    }
    if (req.body.password != null){
        const hashed = Bcrypt.hash(req.body.password)
        res.user.password =  hashed
    }
    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
    } catch (error) {
        res.status(400).json({reponse : error.message})
    }
})
//deleting one
router.delete ('/:id',getUserById,async (req,res) => {
    try {
        await res.user.remove()
        res.json({reponse : "Supprime avec succes"})
    } catch (error) {
        res.json({reponse : error.message})
    }
})

//Login
router.post ('/login',getUserByMail,async(req,res)=>{
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
    try {
        if (await Bcrypt.compare(req.body.password,res.user.password)){
        const token = jwt.sign({username: res.user.email}, "SECRET")
        if (token){
            res.json({token: token,
            user:res.user,
            reponse:"good"})
        }
        }else
        res.json({
            nom: res.user.nom,
            prenom: res.user.prenom,
            email: res.user.email,
            password: hashedPass,
            numt: res.user.numt
        })
        
    } catch (error) {
        res.status(400).json({reponse : "mdp incorrect"})
    } 
})

async function getUserById(req,res,next){
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null){
            return res.status(404).json({reponse : "Utilisateur non trouve"})
        }
    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}

async function getUserByMail (req,res,next){
    let user
    try {
        user = await User.findOne({email:req.body.email})
        if (user == null){
            return res.status(404).json({reponse : "mail non trouve"})
        }

    } catch (error) {
        return res.status(500).json({reponse: error.message})
    }
    res.user = user
    next()
}

function authentificateToken (req,res,next){
    const autHeader = req.headers['authorization']
    const token = autHeader && autHeader.split(' ')[1]

    if (token == null) return res.status(401).json({reponse:"no token"})

    jwt.verify(token, "SECRET", (err,user)=>{
        if (err) return res.status(403).json({reponse:"token invalide"})
        req.user=user
        next()
    })

}
module.exports = router