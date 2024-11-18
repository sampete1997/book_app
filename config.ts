import mongoose from "mongoose";
import * as dotenv from 'dotenv'
dotenv.config()

const uri: string = process.env.MONGO_URL || '' // Replace with your MongoDB URI

// Mongoose connectionfunction mongoConnction () {
class MongoConnction {
  async init() {
    try {
      const connection = await mongoose.connect(uri);
      return connection;
    } catch (error:any) {
      throw new Error(error);
    }
  }
}

export default MongoConnction;
