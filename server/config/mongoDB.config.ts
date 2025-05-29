import mongoose from "mongoose";
import dotenv from "dotenv";
import AppError from "../utils/AppError.utils";
import { unknown } from "zod";

dotenv.config();
const mongoDB = process.env.MONGODB_URI;
if (!mongoDB) {
  throw new Error("MONGODB_URI is not defined in .env file");
}

const connectDB = async () => {
  try {
    await mongoose.connect(mongoDB);
    console.log("MongoDB connected");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export default connectDB;
