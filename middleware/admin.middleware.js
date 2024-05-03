const Admin = require('../model/adminstration');

const fetchAdmin = async(req,res,next)=>{
    try{
        let currentAdmin = await Admin.findById(req.body.admin);
        if(!currentAdmin){
            return res.status(401).json({message:"unauthorized"})
        }
        next();

    }catch(error){
        console.error(error.message);
       return res.status(500).json({message: "unauthorized"});
    }

}

module.exports = fetchAdmin;