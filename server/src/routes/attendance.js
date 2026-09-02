import express from "express";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import { protect, hrOnly } from "../middleware/auth.js";

const router = express.Router();
const today = () => new Date().toISOString().slice(0, 10);

router.get("/today", protect, async (req, res) => {
  const record = await Attendance.findOne({ employee: req.user._id, date: today() });
  res.json(record || { date: today(), status: "absent" });
});

router.post("/check-in", protect, async (req, res) => {
  const date = today();
  let record = await Attendance.findOne({ employee: req.user._id, date });
  if (record?.checkIn) return res.status(400).json({ message: "Already checked in today" });
  if (!record) record = new Attendance({ employee: req.user._id, date });
  record.checkIn = new Date();
  record.status = "checked-in";
  await record.save();
  res.json(record);
});

router.post("/check-out", protect, async (req, res) => {
  const record = await Attendance.findOne({ employee: req.user._id, date: today() });
  if (!record?.checkIn) return res.status(400).json({ message: "Check in first" });
  if (record.checkOut) return res.status(400).json({ message: "Already checked out today" });
  record.checkOut = new Date();
  record.workingMinutes = Math.max(0, Math.round((record.checkOut - record.checkIn) / 60000));
  record.status = "checked-out";
  await record.save();
  res.json(record);
});

router.get("/mine", protect, async (req, res) => {
  const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 }).limit(90);
  res.json(records);
});

router.get("/all", protect, hrOnly, async (req, res) => {
  const records = await Attendance.find().populate("employee", "name email department").sort({ date: -1 }).limit(500);
  res.json(records);
});

export default router;
