const Admin = require('../model/adminstration');

const paymentStatus = async(req,res,next)=>{

    let currentAdmin = Admin.findById(req.body.admin);
    if(!currentAdmin.access){
        return res.status(402).send({message:"Please clear you dues to resume services"});
    }
        next();
} 

module.exports = paymentStatus;