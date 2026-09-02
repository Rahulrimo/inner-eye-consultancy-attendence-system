import express from "express";
import Leave from "../models/Leave.js";
import User from "../models/User.js";
import { protect, hrOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/mine", protect, async (req, res) => {
  res.json(await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 }));
});

router.post("/", protect, async (req, res) => {
  const { startDate, endDate, days, reason } = req.body;
  if (!startDate || !endDate || !days || !reason) return res.status(400).json({ message: "All leave fields are required" });
  if (Number(days) > req.user.monthlyLeaveBalance) return res.status(400).json({ message: "Requested leave exceeds current balance" });
  const leave = await Leave.create({ employee: req.user._id, startDate, endDate, days: Number(days), reason });
  res.status(201).json(leave);
});

router.get("/all", protect, hrOnly, async (req, res) => {
  res.json(await Leave.find().populate("employee", "name email department").sort({ createdAt: -1 }));
});

router.patch("/:id/status", protect, hrOnly, async (req, res) => {
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  const leave = await Leave.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: "Leave request not found" });
  if (leave.status !== "approved" && status === "approved") {
    const employee = await User.findById(leave.employee);
    if (employee.monthlyLeaveBalance < leave.days) return res.status(400).json({ message: "Employee leave balance is insufficient" });
    employee.monthlyLeaveBalance -= leave.days;
    await employee.save();
  }
  leave.status = status;
  leave.reviewedBy = req.user._id;
  await leave.save();
  res.json(leave);
});

export default router;
