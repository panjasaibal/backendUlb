const SuperAdminstration = require('../model/superadmin.model.js')

const fetchSuperAdmin = async(req,res,next)=>{
    try{
        let currentSuperAdmin = await SuperAdminstration.findById(req.body.superadmin);
        if(!currentSuperAdmin){
            return res.status(401).send({message:"unauthorized"})
        }
        next();

    }catch(error){
       return res.status(500).send({message: error.message});
    }

}
module.exports = fetchSuperAdmin;