import mongoose from "mongoose";
import { config } from "./config";
import { wait } from "@panjasaibal/backend_ulb_shared";
const url = "mongodb://127.0.0.1:27017/ULbDatabse";

async function connectToMoongoose(): Promise<void> {
  const maxRetry = 5;
  const retryDelay = 5000;
  for (let attempt = 1; attempt < maxRetry; attempt++) {
    try {
      const connectionInstance = await mongoose.connect(`${config.MONGO_URL}`);
      //console.log(connectionInstance)
      console.log(
        `connected with database !! DB HOST:${connectionInstance.connection.host}`,
      );
      return;
    } catch (error) {
      console.error(`Databse connection FAILED: ${error}`);
      console.log(`trying to connect. ${attempt} attempt of ${maxRetry}`);
      if (attempt === maxRetry) {
        console.error(`Databse connection FAILED: ${error}`);
        process.exit(1);
      }
      //process.exit(1);
      await wait(retryDelay);
    }
  }
}

export { connectToMoongoose };
