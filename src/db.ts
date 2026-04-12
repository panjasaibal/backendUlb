import mongoose from "mongoose";
import { config } from "./config";
import { wait } from "@panjasaibal/backend_ulb_shared";

async function connectToMoongoose(): Promise<void> {
  const maxRetry = 5;
  const retryDelay = 2000;
  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    try {
      const connectionInstance = await mongoose.connect(config.MONGO_URL!);

      console.log(
        `connected with database !! DB HOST:${connectionInstance.connection.host}`,
      );

      return;
    } catch (error) {
      console.error(`Databse connection FAILED: ${error}`);
      if (attempt === maxRetry) {
        throw error;
      }

      console.log(`trying to connect. ${attempt + 1} attempt of ${maxRetry}`);
      await wait(retryDelay);
    }
  }
}

export { connectToMoongoose };
