const {validationResult } = require("express-validator");

const Supervisor = require('../model/supervisor.model');
const Duty = require('../model/duty');
const asyncHandler = require("../util/asyncHandler");
const ApiError = require("../util/ApiError");

exports.loginSupervisor = async (req, res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let supervisor = await Supervisor.findOne({phone:req.body.phone}).select('-admin');
        if(supervisor===null){
            return res.status(400).json({error:"Supervisor not found"});
        }
        const data = {result:{supervisor}, success:true};
        res.json(data);

    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
}

exports.genarateDuty = async(req,res)=>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        const{duty_name, description,place,supervisor, workers} = req.body;

        const duty = await Duty.create({
            duty_name:duty_name,
            description:description,
            place:place,
            supervisor:supervisor,
            workers:workers
        });

        const data = {success:true,duty_id:duty._id};
        res.json(data);

    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
}

exports.getDuty = asyncHandler(async(req,res)=>{
    const duty = await Duty.findById(req.params.id);
    if(!duty){
        //throw new ApiError(404,"Not Found");
        return res.status(404).json({message:"Not Found", success:"false"});
    }

    res.status(200).json({data:duty, success:"true"})
})