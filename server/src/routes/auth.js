import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

function token(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, department } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, department });
    res.status(201).json({ token: token(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, monthlyLeaveBalance: user.monthlyLeaveBalance } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: token(user), user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, monthlyLeaveBalance: user.monthlyLeaveBalance } });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
