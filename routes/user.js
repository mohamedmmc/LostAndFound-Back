const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('../Middleware/multer-config')
const nodemailer = require("nodemailer");
const Token = require('../models/Token');
const crypto = require('crypto');


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
    await User.init();

    const hashedPass = await Bcrypt.hash(req.body.password,10)
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
        res.status(201).json({user:newUser,
                            reponse: "good"})
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


router.post ('/testphoto',multer,async (req,res) => {
    const user = new User({
        photoProfil: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })
    try {
        const newUser = await user.save()
        res.send(req)
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
})


//creating one Using Social Media
router.post ('/Social',multer,async (req,res) => {
    await User.init();

    const user = new User({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        photoProfil: `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`
    })

    
    try {
        const newUser = await user.save()
        var token = new Token({ email: user.email, token: crypto.randomBytes(16).toString('hex') });
        await token.save();
        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fanart3a18@gmail.com',
                pass: '3A18java123'
            }
        });


        var mailOptions = { from: 'fanart3a18@gmail.com', to: user.email, subject: 'Account Verification Link', text: 'Hello ' + user.nom + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });

            }
            return res.status(200)
                .json(
                    {
                        msg: 'A verification email has been sent to ' + user.email +
                            '. It will be expire after one day. If you not get verification Email click on resend token.',
                        user: user
                    });
        });
        // res.status(201).json({
        //     success: true,
        //     message: "User Created!",
        //     user: user
        // });


        res.status(201).json({user:user,
                            reponse: "good"})
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
})

router.get('/confirmation/:email/:token', async (req, res, next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        // if token is found then check valid user 
        else {
            User.findOne({ email: token.email, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                }
                // user is already verified
                else if (user.isVerified) {
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else {
                    // change isVerified to true
                    user.isVerified = true;
                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });

});

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


//login Social media (mail only)
router.post ('/login',getUserByMail,async(req,res)=>{
    if (res.user == null){
        return res.status(404).send("Utilisateur introuvable")
    }
    try {
        const token = jwt.sign({username: res.user.email}, "SECRET")
        if (token){
            res.json({token: token,
            user:res.user,
            reponse:"good"})
        }
        
        
    } catch (error) {
        res.status(400).json({reponse : "mdp incorrect"})
    } 
})



//Login
router.post ('/testmail',getUserByMail,mail,async(req,res)=>{
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
router.get('/confirmation/:email/:token', async (req, res, next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        // if token is found then check valid user 
        else {
            User.findOne({ email: token.email, email: req.params.email }, function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                }
                // user is already verified
                else if (user.isVerified) {
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else {
                    // change isVerified to true
                    user.isVerified = true;
                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).send('Your account has been successfully verified');
                        }
                    });
                }
            });
        }

    });

});

function mail (req,res,next){
    var smtpTrans = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fanart3a18@gmail.com',
            pass: '3A18java123'
        }
    });


    var mailOptions = { from: 'fanart3a18@gmail.com', to:"mohamedmelek.chtourou@esprit.tn", subject: 'Account Verification Link', text: 'Hello ' + "user.username" + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/user\/confirmation\/' + "user.email" + '\/' + "token.token" + '\n\nThank You!\n' };
    console.log(mailOptions)
    smtpTrans.sendMail(mailOptions, function (err) {
        if (err) {
            return res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });

        }
        return res.status(200)
            .json(
                {
                    msg: 'A verification email has been sent to ' + "user.email" +
                        '. It will be expire after one day. If you not get verification Email click on resend token.',
                    user: "user"
                });
    });
}
module.exports = router