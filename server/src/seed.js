import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./models/User.js";

await mongoose.connect(process.env.MONGO_URI);
const password = process.env.SEED_HR_PASSWORD;
if (!password) throw new Error("Set SEED_HR_PASSWORD before running the seed.");
const hashed = await bcrypt.hash(password, 12);
await User.findOneAndUpdate(
  { email: process.env.SEED_HR_EMAIL || "hr@example.com" },
  { name:"HR Admin", email:process.env.SEED_HR_EMAIL || "hr@example.com", password:hashed, role:"hr", department:"Human Resources" },
  { upsert:true, new:true }
);
console.log("HR account seeded.");
await mongoose.disconnect();
