const fs = require('fs');

const errorLogger = (err, req,res, next)=>{

    const timestamp = new Date().toISOString();
    const errMessage = `${timestamp} - ${err.stack}`;

    fs.appendFile("errLogger.log",errMessage,(error)=>{
        if(error){
            console.log("Something went wrong!!");
        }
    })
};

module.exports = errorLogger;