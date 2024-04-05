const Admin = require('../model/adminstration');

const paymentStatus = async(req,res,next)=>{

    let currentAdmin = await Admin.findOne({email:req.body.email});
    if(!currentAdmin.access){
        console.log(currentAdmin)
        console.log(currentAdmin.access)
        return res.status(402).send({message:"Please clear you dues to resume services"});
    }
        next();
} 

module.exports = paymentStatus;