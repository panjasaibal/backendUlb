const express = require('express');
const Adminstration = require('../model/adminstration');

const router = express.Router();
const {body, validationResult} = require('express-validator');
const Worker = require('../model/workers');
const Duty = require('../model/duty');
const UserTrackDuty = require('../model/usertrackduty');
const paymentStatus = require('../middleware/paymentCheck.middleware');
const fetchAdmin = require('../middleware/admin.middleware');

//admin login "/adminlogin"

router.post('/loginadmin',paymentStatus,[
    body('email','Please enter a valid email').isEmail(),
    body('passwd','Password should be atleast 4 charecters').isLength({min:4}),

], async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let adminUser = await Adminstration.findOne({email:req.body.email});
        if(adminUser===null || adminUser.passwd!==req.body.passwd){
            return res.status(400).json({'error':"Incorrect email or password", success:false});
        }
        const data = {id:adminUser._id, name:adminUser.name, access:adminUser.access, email:adminUser.email};
        res.json({result:data});

    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
})

//create Admin "/addworker"
router.post('/addworker',fetchAdmin,[
    body('name','Please enter a valid name').isLength({min:3}),
    body('phone','Please enter a valid phone number').isLength({min:10,max:10}),
    body('admin'),
   
], async(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        let worker = await Worker.findOne({phone:req.body.phone});
        if(worker){
            return res.status(400).json({error:'user already exists with this phone number', success:false});
        }
        worker = await Worker.create({
            admin:req.body.admin,
            name:req.body.name,
            phone:req.body.phone
        });

        const data = {id:worker._id, success:true}
        res.json(data);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')

    }
    
})

//get allworker for each admin

router.get('/getAllWorker/:admin', async(req, res)=>{
    try{
        let workers = await Worker.find({admin:req.params.admin});
        if(!workers){
            return res.status(204).json({message:"no wrokers present"});
        }
        res.status(200).json(workers);

    }catch(error){
        console.error(error.mesasge);
        res.status(500).send('Internal server error');
    }
});

//get worker "/getworker/:phonenumber"

router.get('/getworker/:phone', async(req, res)=>{
    const phoneNumber = req.params.phone;
    if(phoneNumber.length!==10){
        return res.status(400).json({errors:"Phone number should have 10 charecters"});
    }
    try{
        const worker = await Worker.findOne({phone:phoneNumber});
        if(worker===null){
            return res.status(400).json({errors:"Phone number should have 10 charecters"});
        }
        res.json(worker);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')

    }
    
})

//add duty "/addduty"

router.post('/addduty',[
    body('name','Please enter a valid name').isLength({min:3}),
    body('description','Please enter a valid phone number').isLength({min:1}),
    body('worker'),
    body('admin')

], async(req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
       
        const {name,description, worker} = req.body;
        
        let wroker = await Worker.findOne({_id:worker});
        if(!wroker){
             return res.status(400).json({error:'worker does not exist', success:false})
        }
        const newDuty = new Duty({name, description, worker});
        let savedDuty = newDuty.save();

        res.send(savedDuty);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')

    }

})

//get All duties of the specific worker "/getAllDuties"

router.get("/getAllDuties/:id", async (req, res)=>{

    try{
        let duties = await Duty.find({worker: req.params.id})
        res.json(duties);

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error !!");
    }
});

//get tracking details of specific worker

router.get("/trackWorker/:id", async(req, res)=>{
    try{
        let trackData = await UserTrackDuty.findOne({worker:req.params.id});
        if(!trackData){
            res.status(400).json({"mesasge":"Invalid tracking details"})
        }
        res.json(trackData);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal Server error");
    }
});

 //removeWorker
router.delete('/:adminId/:id',async(req,res)=>{
    let worker = await Worker.findById(req.params.id)
    console.log("wrkr",worker)
    if(!worker){
        return res.status(404).json({mesasge:"Nor Found"});
    }
    if(req.params.adminId !== worker.admin.toString()){
        console.log("Admin:",worker.admin);
        console.log("params ",req.params.adminId)
        return res.status(401).json({mesasge:"No Access"});
    }
    worker = await Worker.findByIdAndDelete(req.params.id);
    res.json({message:"Worker has been removed successfully"})


})

module.exports = router;

