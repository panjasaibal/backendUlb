const express = require("express");
const router = express.Router();

const Tracker = require("../model/tracker");
const { body, validationResult } = require("express-validator");

router.get('/getalltrackofuser/:id',async(req,res)=>{
  try{
    const allTrack = await Tracker.find({worker:req.params.id});
    if(allTrack.length===0){
     return res.status(404).send({error:'No Such Records'});
    }
    res.json(allTrack);
  }catch(error){
    console.log("Something went wrong: ", error.message);
    res.status(500).send({message:error.message});
  }
 
})

router.post("/getTrackByDateAndId", async(req,res)=>{
  try{
    const allTrack = await Tracker.find({date:req.params.date, worker:req.params.id});
    if(allTrack.length===0){
     return res.status(404).send({error:'No Such Records'});
    }
    res.json(allTrack);
  }catch(error){
    console.log("Something went wrong: ", error.message);
    res.status(500).send({message:error.message});
  }
});

router.get("/:id", async (req, res) => {
  try {
    let currentTracking = await Tracker.findById(req.params.id);
    if (!currentTracking) {
      return res
        .status(404)
        .json({ error: "track id does not exist", success: false });
    }
    res.json(currentTracking);

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error !!");
  }
});

//create tracking: '/'

router.post(
  "/",
  [
    body("latitude", "Should not be empty").isLength({min:1}),
    body("longitude", "Should not be empty").isLength({min:1})
  ],async (req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
     return res.status(400).json({errors:errors.array});
    }
    try{
      const { worker, address, latitude, longitude } = req.body;
      let newUserTrack = await Tracker.create({
        worker: worker,
        address:address,
        latitude: latitude,
        longitude: longitude,
      });
      res.status(201).json({trackId:newUserTrack._id});
      
    }catch(error){
      console.log("Internal Server Error")
      res.status(500).send({error:error.message})
    }
  }
);

module.exports = router;
