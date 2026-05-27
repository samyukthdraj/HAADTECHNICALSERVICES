import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("❌ MONGODB_URI environment variable is missing in .env!");
    throw new Error("MONGODB_URI environment variable is missing");
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`=================================================`);
    console.log(` 🔌 MONGODB CONNECTED: ${conn.connection.host}`);
    console.log(` Database Name: ${conn.connection.name}`);
    console.log(`=================================================`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};
