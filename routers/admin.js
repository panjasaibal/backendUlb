const express = require('express');
const Adminstration = require('../model/adminstration');

const router = express.Router();
const {body, validationResult} = require('express-validator');
const Worker = require('../model/workers');
const Duty = require('../model/duty');
const UserTrackDuty = require('../model/usertrackduty');
const Tracker = require('../model/tracker');
const paymentStatus = require('../middleware/paymentCheck.middleware');
const fetchAdmin = require('../middleware/admin.middleware');
const adminController = require('../controller/admin.controller')

//admin login "/adminlogin"

router.post('/loginadmin',paymentStatus,[
    body('email','Please enter a valid email').isEmail(),
    body('passwd','Password should be atleast 4 charecters').isLength({min:4}),
], 
    adminController.adminLogin
);

//create Admin "/addworker"
router.post('/addworker',fetchAdmin,[
    body('name','Please enter a valid name').isLength({min:3}),
    body('phone','Please enter a valid phone number').isLength({min:10,max:10}),
    body('admin'),
   
], adminController.addWorker);

//get allworker for each admin

router.get('/getAllWorker/:admin', adminController.getAllWorker);

//get worker "/getworker/:phonenumber"

router.get('/getworker/:phone', adminController.getWorkerByPhone);

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

        res.json(savedDuty);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')

    }

});

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

//get tracking details for workers of the particular admin

router.get('/getTracks/:adminId', adminController.getLatestTracksOfWorkerByAdminId);

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
router.delete('/:adminId/:id',adminController.deleteWorkerById);

module.exports = router;

