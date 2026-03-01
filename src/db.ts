import mongoose from "mongoose";
import { config } from "./config";
const url = 'mongodb://127.0.0.1:27017/ULbDatabse';

async function connectToMoongoose():Promise<void>{
    try{
        const connectionInstance = await mongoose.connect(`${config.MONGO_URL}`);
        //console.log(connectionInstance)
        console.log(`connected with database !! DB HOST:${connectionInstance.connection.host}`);
    }catch(error){
        console.log(`Databse connection FAILED: ${error}`);
        process.exit(1);
    }
}

export { connectToMoongoose };
