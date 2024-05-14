const Supervisor = require('../model/supervisor.model');
const ApiError = require('../util/ApiError');

const fetchSupervisor = async(req,res,next)=>{

    try{
        const currentSupervisor = await Supervisor.findById(req.body.supervisor);
        if(!currentSupervisor){
            //throw new ApiError(401,"Unauthorized");
           return res.status(401).json({message: "unauthorized"});
        }
        next();
    }catch(error){
       // throw new ApiError(500,"Something went wrong");
        res.status(500).json({message: "Something went wrong"});
    }
}

module.exports = fetchSupervisor;