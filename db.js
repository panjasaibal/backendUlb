const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/ULbDatabse';

const connectToMoongoose = async() => {
    
    try{
        const connectionInstance = await mongoose.connect(`${url}`);
        //console.log(connectionInstance)
        console.log(`connected with database !! DB HOST:${connectionInstance.connection.host}`);
    }catch(error){
        console.log(`Databse connection FAILED: ${error}`);
        process.exit(1);
    }
}

module.exports = connectToMoongoose;
