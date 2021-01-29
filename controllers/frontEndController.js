const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/',(req,res)=>{
    db.Review.findAll({
        include:[db.User,db.Platform]
    }).then(data=>{
        const jsonData = data.map(obj=>{
            const jsonObj =obj.toJSON()
            if(req.session.user){
                jsonObj.isMine = req.session.user.id===jsonObj.User.id
            } else{
                jsonObj.isMine = false;
            }
            return jsonObj
        })
        
        const hbsObj = {
            reviews:jsonData,
            user:req.session.user
        }
        console.log(jsonData);

        res.render("index",hbsObj);
    })
})

router.get('/login',(req,res)=>{
    res.render('login',{
        user:req.session.user
    })
})

router.get('/signup',(req,res)=>{
    res.render('signup',{
        user:req.session.user
    })
})

router.get('/addreview',(req,res)=>{
    if(!req.session.user){
        res.redirect('/login')
    } else{
        res.render('addReview',{
            user:req.session.user
        })
    }
})

router.get('/user/:username',(req,res)=>{
    db.User.findOne({
        where:{
            username:req.params.username
        },
        include:[{
            model:db.Review,
            include:[db.Platform]
        }]
    }).then(userData=>{
        const userJson = userData.toJSON();
        let myProfile = false;
        if(req.session.user &&req.session.user.username === req.params.username){
            myProfile=true;
        }
        const hbsObj={
            username:userJson.username,
            reviews:userJson.Reviews,
            isMyProfile:myProfile,
            user:req.session.user
        }
        console.log(hbsObj)
        res.render("user",hbsObj)
    }).catch(err=>{
        res.status(500).json(err);
    })
})

router.get('/platform/:platform',(req,res)=>{
    db.Platform.findOne({
        where:{
            name:req.params.platform
        },
        include:[{
            model:db.Review,
            include:[db.User]
        }]
    }).then(data=>{
       jsonData = data.toJSON();
       console.log(jsonData);
        // res.json(jsonData);
        const hbsReviews = jsonData.Reviews.map(revi=>{
            if(req.session.user){
                revi.isMine = req.session.user.id===revi.User.id
            } else{
                revi.isMine = false;
            }
            return revi
        })
        const hbsObj= {
            reviews:hbsReviews,
            platform:jsonData.name,
            user:req.session.user
        }
        console.log("=============")
        console.log(hbsObj);
        res.render("platform",hbsObj);
    })
})


module.exports = router;