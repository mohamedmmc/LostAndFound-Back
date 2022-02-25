const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Article = require('../models/article')
const Report = require('../models/report')


//getting all
router.get ('/', async (req,res) => {
    try {
        const report = await Report.find().populate('article').populate('user')
        res.json({reports:report})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}) 


router.post ('/',getReport,async (req,res) => {

    if (!res.report){
            const newReport = new Report({
                user: req.body.user,
                article: req.body.article
            })
            console.log(newReport)
            const nami = await newReport.save()
            return res.json(nami)
        }else if (res.report.user.length == 5){
            await res.report.remove()
            return res.json({message:"spam"})

        }else{
            for (i=0;i<res.report.user.length;i++){
                if (res.report.user[i] == req.body.user){
                    return res.json({message:"same user"})
                }
            }
            let toul = res.report.user.length
            res.report.user.push(req.body.user)
            try {
                const nezupdatedQuestion = await res.report.save()
    
            return res.json({message:nezupdatedQuestion})
            } catch (error) {
                console.log(error)
            }        }
   
    
})


router.delete ('/:id',async (req,res) => {
    try {
        report = await Report.findById(req.params.id)
        await report.remove()
        res.json("done")
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
})

async function getReport (req,res,next){
    let report
    try {
        report = await Report.findOne({article : req.body.article})
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    res.report = report
    next()
}

module.exports = router