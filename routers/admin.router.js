const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const paymentStatus = require('../middleware/paymentCheck.middleware');
const fetchAdmin = require('../middleware/admin.middleware');
const fetchSupervisor = require('../middleware/supervisor.middleware');
const adminController = require('../controller/admin.controller')

//admin login "/adminlogin"

router.post('/loginadmin',paymentStatus,[
    body('email','Please enter a valid email').isEmail(),
    body('passwd','Password should be atleast 4 charecters').isLength({min:4}),
], 
    adminController.adminLogin
);

//create Worker "/addworker"
router.post('/addworker',fetchSupervisor,[
    body('name','Please enter a valid name').isLength({min:3}),
    body('phone','Please enter a valid phone number').isLength({min:10,max:10}),
    body('supervisor')
   
], adminController.addWorker);

//create supervisor "/addsupervisor"

router.post('/addsupervisor', fetchAdmin,[
    body('name','Please enter a valid name').isLength({min:3}),
    body('phone','Please enter a valid phone number').isLength({min:10,max:10}),
    body('admin'),
], adminController.addSupervisor);

//get allworker for each admin

router.get('/getAllWorker/:admin', adminController.getAllWorker);

//get worker "/getworker/:phonenumber"

router.get('/getworker/:phone', adminController.getWorkerByPhone);

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

