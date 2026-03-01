const fs = require('fs');
const ApiResponse = require('../util/ApiResponse');

const errorLogger = (err, req,res, next)=>{

    const timestamp = new Date().toISOString();
    const errMessage = `${timestamp} - ${err.stack}`;
    
    fs.appendFile("errLogger.log",errMessage,(error)=>{
        if(error){
            console.log("Something went wrong!!");
        }
    })

    return res.status(err.statusCode?err.statusCode:500).json(new ApiResponse(err.statusCode,err))
};

module.exports = errorLogger;