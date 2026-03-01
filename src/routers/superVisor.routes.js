const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
//const supervisorController = require('../controller/supervisor.controller');
const supervisorController = require('../controller/supervisor.controller');
const fetchSupervisor = require('../middleware/supervisor.middleware');
const upload = require('../middleware/multer.middleware');

//supervisor login
router.post('/loginsupervisor',[
    
    body('phone','Enter a valid phone number').isLength({min:10, max:10}),
], supervisorController.loginSupervisor);

//create duty

router.post('/createduty', upload.single('duty_image')
,supervisorController.genarateDuty)

//get duty by supervisor id
router.get('/getDuty/:supervisor', fetchSupervisor, supervisorController.getDutyBySupervisor);

//get workers by supervisor id

router.get('/getWorkers/:supervisor', fetchSupervisor,supervisorController.getAllWorkersForSupervisor);

//get duty by duty _id
router.get('/:id',supervisorController.getDuty);


module.exports = router;
