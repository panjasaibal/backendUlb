const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
//const supervisorController = require('../controller/supervisor.controller');
const supervisorController = require('../controller/supervisor.controller');
const fetchSupervisor = require('../middleware/supervisor.middleware');

//supervisor login
router.post('/loginsupervisor',[
    
    body('phone','Enter a valid phone number').isLength({min:10, max:10}),
], supervisorController.loginSupervisor);

//create duty

router.post('/createduty',[

],fetchSupervisor, supervisorController.genarateDuty);


//get duty by supervisor id



//get duty by duty _id
router.get('/:id',supervisorController.getDuty);



module.exports = router;
