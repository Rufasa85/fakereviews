const express = require('express');
const router = express.Router();
const db = require('../models');

router.get("/",(req,res)=>{
    db.Platform.findAll({
        include:[db.Review]
    }).then(data=>{
        res.json(data)
    }).catch(err=>{
        res.status(500).json(err);
    })
})

router.post('/',(req,res)=>{
    if(!req.session.user){
        res.status(401).send("not logged in")
    } else{
        db.Platform.create({
            name:req.body.name
        }).then(data=>{
            res.json(data)
        }).catch(err=>{
            res.status(500).json(err)
        })
    }
})


module.exports = router;