const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/ULbDatabse';

const connectToMoongoose = async() => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`)
        //console.log(connectionInstance)
        console.log(`connected with database !! DB HOST:${connectionInstance.connection.host}`)
    }catch(error){
        console.log(`Databse connection FAILED: ${error}`);
        process.exit(1);
    }
    //  mongoose.connect(process.env.MONGO_URL).then(() => {
    //     console.log("connected with database")
    // }).catch((err)=>{
    //     console.log(err.message)
    // })
}

module.exports = connectToMoongoose;
