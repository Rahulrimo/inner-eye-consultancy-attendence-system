import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["employee", "hr"], default: "employee" },
  department: { type: String, default: "General" },
  monthlyLeaveBalance: { type: Number, default: 12 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
