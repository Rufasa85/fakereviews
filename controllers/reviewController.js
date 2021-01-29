const express = require('express');
const router = express.Router();
const db = require('../models');

router.get("/",(req,res)=>{
    db.Review.findAll({
        include:[db.Platform]
    }).then(data=>{
        res.json(data)
    }).catch(err=>{
        res.status(500).json(err);
    })
})

router.get('/platform/:id',(req,res)=>{
    db.Platform.findOne({
        where:{
            id:req.params.id
        },
        include:[db.Review]
    }).then(data=>{
        res.json(data)
    }).catch(err=>{
        res.status(500).json(err);
    })
})

router.get("/myreviews",(req,res)=>{
    if(!req.session.user){
        res.status(401).send('not logged in')
    }
    else {
        db.Review.findAll({
            where:{
                UserId:req.session.user.id
            }
        }).then(data=>{
            res.json(data)
        }).catch(err=>{
            res.status(500).json(err);
        })
    }
})

router.post('/',(req,res)=>{
    if(!req.session.user){
        res.status(401).send("not logged in")
    } else{
        db.Review.create({
            title:req.body.title,
            review:req.body.review,
            score:req.body.score,
            UserId:req.session.user.id
        }).then(newReview=>{
            const platformsArr = req.body.platforms.split(",");
            platformsArr.forEach(id=>{
                newReview.addPlatform(id);
            })
            console.log(req.body.platforms);
            res.json(newReview)
        }).catch(err=>{
            res.status(500).json(err)
        })
    }
})

module.exports = router;