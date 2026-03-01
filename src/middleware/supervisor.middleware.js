const Supervisor = require('../model/supervisor.model');
const ApiError = require('../util/ApiError');
const asyncHandler = require('../util/asyncHandler');

const fetchSupervisor = asyncHandler(async(req,res,next)=>{

        const currentSupervisor = await Supervisor.findById(req.body.supervisor);
        console.log(currentSupervisor)
        if(!currentSupervisor){
            //throw new ApiError(401,"Unauthorized");
           return res.status(401).json({message: "unauthorized"});
        }
        next();
    })


module.exports = fetchSupervisor;