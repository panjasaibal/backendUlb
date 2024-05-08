const express = require("express");
const router = express.Router();
const { body} = require("express-validator");
const trackerController = require("../controller/tracker.controller");

//get All Tracks of the worker '/getalltrackofuser/:id'
router.get('/getalltrackofuser/:id',trackerController.getAllTrackOfUser);

//get All Tracks of the worker by date '/gettrackbydateandid'
router.post("/getTrackByDateAndId", trackerController.getAllTrackByUserAndDate);

//get Track details by id
router.get("/:id", trackerController.getTrackerDetailsById);

//create tracking: '/'

router.post(
  "/",
  [
    body("latitude", "Should not be empty").isLength({min:1}),
    body("longitude", "Should not be empty").isLength({min:1}),
    
  ],trackerController.createTrackerForUser
);

module.exports = router;
