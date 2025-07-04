import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URI;
export const dBConnection = async (req, res) => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("DB is connected successfully");
  } catch (error) {
    console.error("DB is not connected", error);
  }
};
