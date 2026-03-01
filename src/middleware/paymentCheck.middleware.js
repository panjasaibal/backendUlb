const Admin = require('../model/adminstration');

const paymentStatus = async(req,res,next)=>{

    let currentAdmin = await Admin.findOne({email:req.body.email});
    if(currentAdmin){
        if(!currentAdmin.access){

            return res.status(402).json({message:"Please clear you dues to resume services"});
        }
    }else{
        return res.status(404).json({'error':"Incorrect email or password"})
    }
    
        next();
} 

module.exports = paymentStatus;