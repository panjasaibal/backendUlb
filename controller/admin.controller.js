const {validationResult } = require("express-validator");
const Adminstration = require("../model/adminstration");
const Worker = require("../model/workers");
const Tracker = require("../model/tracker");
const Duty = require("../model/duty");
const Supervisor = require("../model/supervisor.model");

exports.adminLogin = async(req,res)=>{

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
        let adminUser = await Adminstration.findOne({email:req.body.email});
        if(adminUser===null || adminUser.passwd!==req.body.passwd){
            return res.status(400).json({'error':"Incorrect email or password", success:false});
        }
        const data = {id:adminUser._id.toString(), name:adminUser.name, access:adminUser.access, email:adminUser.email};
        res.json({result:data});
    }catch(error){
        console.error(error.message); 
        res.status(500).send('Internal server error');
    }
};

exports.addWorker = async(req,res)=>{

    async(req, res)=>{
        const errors = validationResult(req);
    
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }
        try {
            let worker = await Worker.findOne({phone:req.body.phone});
            if(worker){
                return res.status(400).json({error:'user already exists with this phone number', success:false});
            }
            worker = await Worker.create({
                admin:req.body.admin,
                name:req.body.name,
                phone:req.body.phone
            });
    
            const data = {id:worker._id, success:true}
            res.json(data);
    
        }catch(error){
            console.error(error.message); 
           res.status(500).send('Internal server error');
        }
    }
} 


exports.addSupervisor = async(req,res)=>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
        let supervisor = await Supervisor.findOne({phone:req.body.phone});
        if(supervisor){
            return res.status(400).json({error:'user already exists with this phone number', success:false});
        }
        supervisor = await Supervisor.create({
            admin:req.body.admin,
            name:req.body.name,
            phone:req.body.phone,
        });

        const data = {id:supervisor._id, success:true}
        res.json(data);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error');
    }

}

exports.getAllWorker = async(req, res)=>{
    try{
        let workers = await Worker.find({admin:req.params.admin});
        if(!workers){
            return res.status(204).json({message:"no wrokers present"});
        }
        res.status(200).json(workers);

    }catch(error){
        console.error(error.mesasge);
        res.status(500).send('Internal server error');
    }
};

exports.getAllSuperVisor = async(req,res)=>{
    
};

exports.getWorkerByPhone = async(req,res)=>{
    const phoneNumber = req.params.phone;
    if(phoneNumber.length!==10){
        return res.status(400).json({errors:"Phone number should have 10 charecters"});
    }
    try{
        const worker = await Worker.findOne({phone:phoneNumber});
        if(worker===null){
            return res.status(400).json({errors:"Phone number should have 10 charecters"});
        }
        res.json(worker);

    }catch(error){
        console.error(error.message); 
       res.status(500).send('Internal server error')
    }
};

exports.getLatestTracksOfWorkerByAdminId = async(req,res)=>{
    try{
        let admin = await Adminstration.findById(req.params.adminId).select('-superadmin');
        if(!admin){
            return res.status(500).json({error:"Bad request"});
        }
        let workers = await Worker.find({admin:req.params.adminId});
        let tracks = []
        const date = new Date().toLocaleDateString()
        console.log(date)
        for(let worker of workers){
            let track = await Tracker.findOne({worker:worker._id.toString(), date:date}).sort({_id:-1});
            if(track){
                let obj = {data:track,workerName:worker.name,phone:worker.phone}
                tracks.push(obj);
            }
        }
        //console.log(workers)
        res.json(tracks);
    }catch(e){
        console.log(e.message);
        res.status(500).send("Internal Server error");
    }
};


exports.getDutyBySupervisor = async(req,res)=>{
    const {supervisor, date} = req.body;
    try{
        const duty = await Duty.find({supervisor:supervisor,date:date});
        if(duty==null){
            return res.status(400).json("No such duties");
        }
        const data = {data:duty,success:true};
        res.json(data);
    }catch(err){
        console.log(e.message);
        res.status(500).send("Internal Server error");
    }
}

exports.deleteWorkerById = async(req,res)=>{
    try{
        let worker = await Worker.findById(req.params.id)
        if(!worker){
            return res.status(404).json({mesasge:"Nor Found"});
        }

        if(req.params.adminId !== worker.admin.toString()){
            return res.status(401).json({mesasge:"No Access"});
        }
        worker = await Worker.findByIdAndDelete(req.params.id);
        console.log("deleted");
        res.json({message:"Worker has been removed successfully"});
    
    }catch(e){
        console.log(e.mesasge);
        res.status(500).send("Internal Server Error");
    }
};


