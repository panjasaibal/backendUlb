const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
//const supervisorController = require('../controller/supervisor.controller');
const supervisorController = require('../controller/superVisor.controller.js');

//supervisor login
router.post('/loginsupervisor',[
    
    body('phone','Enter a valid phone number').isLength({min:10, max:10}),
], supervisorController.loginSupervisor);



module.exports = router;
