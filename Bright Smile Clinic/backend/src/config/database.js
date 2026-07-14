import mongoose from "mongoose";
import config from "./config.js";

export default async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // don't let the server run without a working DB
  }
}
