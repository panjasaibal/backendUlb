const express = require('express');
const {body,validationResult} = require('express-validator');
const SuperAdmin = require('../model/superadmin.model');
const Adminstration = require('../model/adminstration');


const router = express.Router();

//create Admin "/"
router.post('/',[
    body('username','Please enter a valid name').isLength({min:3}),
    body('password','Password should be atleast 4 charecters').isLength({min:4}),

], async(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        let superAdminUser = await SuperAdmin.findOne({name:req.body.username});
        if(superAdminUser){
            return res.status(400).json({error:'admin already exists'})
        }
        superAdminUser = await SuperAdmin.create({
            username:req.body.username,
            password:req.body.password
        }) 

        const data = {superAdminUser:{id:superAdminUser._id}}
        res.send(data);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')
    }
});

//login superadmin /loginsuperadmin
router.post('/loginsuperadmin',[
    body('name','Please enter a valid email').isLength({min:5}),
    body('password','Password should be atleast 4 charecters').isLength({min:4}),

], async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let superadminUser = await SuperAdmin.findOne({name:req.body.name});
        if(superadminUser===null || superadminUser.password!==req.body.password){
            return res.status(400).json({'error':"Incorrect email or password", success:false});
        }
        const data = {'id':superadminUser._id,'name':superadminUser.name, success:true};
        res.send(data);

    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
})

router.get('/get', (req, res)=>{
        res.json({'res':'Hello i am api'})
})

//create admin /createadmin
router.post('/createadmin',[
    body('superadmin'),
    body('name','Please enter a valid name').isLength({min:3}),
    body('email','Please enter a valid email').isEmail(),
    body('passwd','Password should be atleast 4 charecters').isLength({min:4}),

], async(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        let superadmin = await SuperAdmin.findById(req.body.superadmin);
        if(!superadmin){
           return res.status(500).send("Access Denied");
        }
        let adminUser = await Adminstration.findOne({email:req.body.email});
        if(adminUser){
            return res.status(400).json({error:'email id already exists'})
        }
        adminUser = await Adminstration.create({
            superadmin:req.body.superadmin,
            name:req.body.name,
            email:req.body.email,
            passwd:req.body.passwd
        }) 

        const data = {adminUser:{id:adminUser._id}}
        res.send(data);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')

    }
    
})

module.exports = router;