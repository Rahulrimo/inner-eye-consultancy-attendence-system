import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import auth from "./routes/auth.js";
import attendance from "./routes/attendance.js";
import leaves from "./routes/leaves.js";
import dashboard from "./routes/dashboard.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (_, res) => {
  res.json({ ok: true });
});

// Routes
app.use("/api/auth", auth);
app.use("/api/attendance", attendance);
app.use("/api/leaves", leaves);
app.use("/api/dashboard", dashboard);

// MongoDB connection with caching
let dbPromise;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!dbPromise) {
    dbPromise = mongoose.connect(process.env.MONGO_URI);
  }

  return dbPromise;
};

// Make sure MongoDB is connected before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

// Local development
if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`API running on http://localhost:${port}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

// Export for Vercel
export default app;