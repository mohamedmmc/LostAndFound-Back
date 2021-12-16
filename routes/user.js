const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken')
const multer = require('../middleware/multer-config')
const nodemailer = require("nodemailer");
const Token = require('../models/Token');
const crypto = require('crypto');
const Article = require ('../models/article')
const bcryptjs = require ('bcryptjs')
const article = require('../models/article')
var cloudinary = require('cloudinary')

cloudinary.config({ 
    cloud_name: 'dy05x9auh', 
    api_key: '277832671356454', 
    api_secret: '34Q-FOG18ZxvtQfCih1BYgy8u84' 
  });
//....................................
//add User

/**
* @swagger 
* tags:
*  name: User
*  description: This is for the main User
* /user:
*  post:
*   tags: [User]
*   summary: Creates a new user.
*   requestBody:
*      content:
*       application/json:
*         schema:
*           type: object
*           properties:
*             identifant:
*              type: string
*             email:
*              type: string
*             password:
*              type: string
*             phoneNumber:
*              type: number
*             profilePicture:
*              type: string
*             FirstName:
*              type: string
*             LastName:
*              type: string
*             verified:
*              type: boolean
*             className:
*              type: string
*             social:
*              type: boolean
*             role:
*              type: string
*             description:
*              type: string
*  responses:
*      201:
*         description: Created
 */



 /**
  * @swagger
 

 * /user:
 *   description: The users managing API
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [usres]
 *     responses:
 *       200:
 *         description: The list users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
  *       500:
 *         description: user error
 */

router.get ('/', async (req,res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.status(500).json({reponse: error.message})
    }
}) 
//getting one
// get one user

/**
* @swagger
* tags:
*  name: User
*  description: This is for the main User
* /user/{email}:
*  get:
*   tags: [User]
*   summary: this Api used to get one user from database
*   description: this api is used to get one user from database
*   parameters:
*     - in: path
*       name: email
*       description: Must provide  email 
*       schema:
*        type: string
*   responses:
*     '200':
*        description: A successful response
*/
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
        const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")
        cloudinary.v2.uploader.upload(req.file.filename, 
            function(error, result) {console.log(result, error)});    
        res.status(201).json({token:tokenJWT,
                            user:newUser,
                            reponse: "good"})
    } catch (error) {
        res.status(400).json({reponse: error.message})
    }
})
//updating one
router.patch ('/:id',getUserById,multer,async (req,res) => {

    
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
   /* if (await Bcrypt.compare(req.body.password,res.user.password)){
    //if (req.body.password != res.body.password){
        const hashed = Bcrypt.hash(req.body.password)
        res.user.password =  hashed
    }*/

    if (req.file.filename != null){
        res.user.photoProfil =  `${req.protocol}://${req.get('host')}/upload/${req.file.filename}`

    }


    try {
        const updatedUser = await res.user.save()
        cloudinary.v2.uploader.upload(req.file.filename, 
            function(error, result) {console.log(result, error)});    
        res.json({reponse:"updated",
            user:updatedUser})
    } catch (error) {
        res.status(400).json({reponse : error.message})
    }
})

//deleting one



/**
* @swagger
* tags:
*  name: User
*  description: This is for the main User
* /user/{id}:
*  delete:
*   tags: [User]
*   summary: this Api used to delete user from database
*   description: this api is used to delete  users from database
*   parameters:
*     - in: path
*       name: id
*       description: Must provide  id 
*       schema:
*        type: string
*   responses:
*     200:
*        description: A successful response
*/
router.delete ('/:id',getUserById,async (req,res) => {
    try {
        //get all user articles and delete them
        const articles = await Article.find({ user: res.user.id });
        console.log(articles)

       for (i=0; i<articles.length;i++){
            articles[i].remove()
            
        }
        //delete the user
         await res.user.remove()
         res.json({reponse : "Supprime avec succes"})
    } catch (error) {
        res.json({erreur : error.message})
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
    
    const tokenJWT = jwt.sign({username: req.body.email}, "SECRET")
    
    try {
        const newUser = await user.save()
        var token = new Token({ email: user.email, token: crypto.randomBytes(16).toString('hex') });
        await token.save();
        cloudinary.v2.uploader.upload(req.file.filename, 
        function(error, result) {console.log(result, error)});   


        var smtpTrans = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'fanart3a18@gmail.com',
                pass: '3A18java123'
            }
        });
        
        
        var mailOptions = { from: 'fanart3a18@gmail.com', to: user.email, subject: 'Verification de compte', text: 'Bonjour/Bonsoir ' + user.nom + ',\n\n' + 'Pour verifier votre compte merci de cliquer sur le lien suivant: \nhttps://lost-and-found-back.herokuapp.com\/' + user.email + '\/' + token.token + '\n\nMerci !\n' };
        smtpTrans.sendMail(mailOptions, function (err) {
            if (err) {
                res.status(500).send({ msg: 'Technical Issue!, Please click on resend for verify your Email.' });
        
            }
        });   
        res.status(201).json({token:tokenJWT,
            user:user,
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
router.post ('/Auth',getUserByMail,async(req,res)=>{
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

router.post('/forgotPassword',getUserByMail, (req, res, next) => {

        // user is not found into database
        if (!res.user) {
            return res.status(400).send({ msg: 'We were unable to find a user with that email. Make sure your Email is correct!' });
        } else {
            var seq = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
            var token = new Token({ email: res.user.email, token: seq });
            token.save(function (err) {
                if (err) {
                    return res.status(500).send({ msg: err.message });
                }

            });

            var smtpTrans = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'fanart3a18@gmail.com',
                    pass: '3A18java123'
                }
            });

            var mailOptions = {
                from: 'fanart3a18@gmail.com', to: res.user.email, subject:
                    'Mot de passe oubliè Lost And Found', text: 'Vous recevez cet email car vous (ou quelqu\'n d\'autre) a fait cette demande de mot de passe oubliè.\n\n' +
                        'Merci de cliquer sur le lien suivant ou copier le sur votre navigateur pour completer le processus:\n\n' + 'Le code est :'+ token.token + '\n\n' +
                        'http:\/\/' + req.headers.host + '\/user\/resetPassword\/' + res.user.email + '\/' + token.token
                        + '\n\n Si vous n\'avez pas fait cette requete, veuillez ignorer ce message et votre mot de passe sera le méme.\n'
            };
            // Send email (use credintials of SendGrid)

            //  var mailOptions = { from: 'no-reply@example.com', to: user.email, subject: 'Account Verification Link', text: 'Hello '+ user.name +',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + user.email + '\/' + token.token + '\n\nThank You!\n' };
            smtpTrans.sendMail(mailOptions, function (err) {
                if (err) {
                    return res.status(500).send({ msg: err });
                }
                else {
                    return res.status(200).send({succes:true, 
                        msg:'A reset password  email has been sent to ' + res.user.email + '. It will be expire after one day. If you not get verification Email click on resend token.',
                        token: token.token
                    })};

            });

        }

    });


router.post('/resetPassword/:email/:token' ,async (req, res, next) => {
    Token.findOne({ token: req.params.token }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token) {
            return res.status(400).send({ msg: 'Your verification link may have expired. Please click on resend for verify your Email.' });
        }
        // if token is found then check valid user 
        else {
            User.findOne({email: req.params.email }, async function (err, user) {
                // not valid user
                if (!user) {
                    return res.status(401).send({ msg: 'We were unable to find a user for this verification. Please SignUp!' });
                } else {

                    const salt = await Bcrypt.genSalt(10);
                    user.password = await Bcrypt.hash(req.body.Password, salt);

                    user.save(function (err) {
                        // error occur
                        if (err) {
                            return res.status(500).send({ msg: err.message });
                        }
                        // account successfully verified
                        else {
                            return res.status(200).json({reponse:'Your password has been successfully reset'});
                        }

                    })

                }

            });
        }});

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