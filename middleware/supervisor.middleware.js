const Supervisor = require('../model/supervisor.model');

const fetchSupervisor = async(req,res,next)=>{
    try{
        const currentSupervisor = await Supervisor.findById(req.body.supervisor);
        if(!currentSupervisor){
            res.status(401).json("Unauthorized");
        }
        next();
    }catch(error){
        res.status(500).json(error.message);
    }
}