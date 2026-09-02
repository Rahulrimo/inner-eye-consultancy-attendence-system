import express from "express";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import { protect, hrOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/employee", protect, async (req, res) => {
  const attendance = await Attendance.find({ employee: req.user._id });
  const approved = await Leave.find({ employee: req.user._id, status: "approved" });
  const totalMinutes = attendance.reduce((s, a) => s + (a.workingMinutes || 0), 0);
  res.json({
    attendanceCount: attendance.length,
    presentCount: attendance.filter(a => ["checked-in", "checked-out"].includes(a.status)).length,
    totalWorkingHours: +(totalMinutes / 60).toFixed(1),
    approvedLeaveDays: approved.reduce((s, l) => s + l.days, 0),
    leaveBalance: req.user.monthlyLeaveBalance
  });
});

router.get("/hr", protect, hrOnly, async (req, res) => {
  const [employees, attendance, pendingLeaves] = await Promise.all([
    User.countDocuments({ role: "employee" }),
    Attendance.find(),
    Leave.countDocuments({ status: "pending" })
  ]);
  const checkedIn = attendance.filter(a => a.status === "checked-in").length;
  const totalHours = attendance.reduce((s, a) => s + (a.workingMinutes || 0), 0) / 60;
  res.json({
    employees, attendanceRecords: attendance.length, checkedIn, pendingLeaves,
    totalWorkingHours: +totalHours.toFixed(1)
  });
});

export default router;
