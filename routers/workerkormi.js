const express = require('express');
const Worker = require('../model/workers');

const router = express.Router();
const {body, validationResult} = require('express-validator');
const Duty = require('../model/duty');
const UserTrackDuty = require('../model/usertrackduty');

//login worker "/loginworker"

router.post('/loginworker',[
    
    body('phone','Enter a valid phone number').isLength({min:10, max:10}),

], async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let worker = await Worker.findOne({phone:req.body.phone});
        if(worker===null){
            return res.status(400).json({'error':"Woker not found"});
        }
        const data = {result:{worker}, success:true};
        res.json(data);

    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
})

//update employee location "/trackLocation/:id"


// track duty and update completion status and location track
router.put("/updateDuty/:id", async(req, res)=>{
    const {completed, endtime, latitude, longitude} = req.body;

    const newDuty = {};
    if(completed){newDuty.completed = completed}
    if(endtime){newDuty.endtime = endtime}
    if(latitude){newDuty.latitude = latitude}
    if(longitude){newDuty.longitude = longitude}

    let duty = await Duty.findById(req.params.id);

    if(!duty){
        return res.status(404).send("Not Found !!!");
    }

    duty = await Duty.findByIdAndUpdate(req.params.id, {$set: newDuty}, {new:true});
    res.json({duty});
});

//get All duties of the specific worker "/getAllDuties/:id"

router.get("/getAllDuties/:id", async (req, res)=>{

    try{
        let duties = await Duty.find({worker: req.params.id})
        res.json(duties);

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error !!")
    }
});

// create tracking "/track"

router.post('/track',[
    body('worker'),
    
],async(req, res)=>{
    
    try{
        const{worker} = req.body;
        let currentWorker = await Worker.findOne({_id:worker});

        if(!currentWorker){
            return res.status(400).json({error:'worker does not exist'});
        }

        const tracker = new UserTrackDuty({worker})
        let savetracker = await tracker.save();
        res.json(savetracker)

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error !!")
    }
})

//update tracking: '/track/:id'
router.put('/track/:id',async(req, res)=>{
   
    try{
        const{latitude, longitude, end_time} = req.body;
        const newUserTrack = {};
        if(latitude){
            newUserTrack.latitude = latitude;
        }
        if(longitude){
            newUserTrack.longitude = longitude;
        }

        if(end_time){
            newUserTrack.end_time = end_time;
        }
        let currentTrack = await UserTrackDuty.findById(req.params.id);

        if(!currentTrack){
            return res.status(400).json({error:'track id does not exist', success:false});
        }
        currentTrack = await UserTrackDuty.findByIdAndUpdate(req.params.id, {$set:newUserTrack}, {new:true});
       
        res.json(currentTrack);

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server error !!");
    }
})


module.exports = router;