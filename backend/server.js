import express from "express";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware.js";
import authRoutes from "./routes/auth.js";
import groupsRoutes from "./routes/groups.js";
import profilesRoutes from "./routes/profiles.js";
import messagesRoutes from "./routes/messages.js";


dotenv.config();

const app = express();

// Enable CORS for all routes and origins
app.use(cors());
app.options(/.*/, cors()); // Enable pre-flight requests for all routes

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  next();
});

app.use(morgan("dev"));
app.use(express.json());

// conectare la MongoDB
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// rute
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/profiles", profilesRoutes);
app.use("/api/messages", messagesRoutes);

app.get("/api/me", authMiddleware, (req, res) => {
  res.json({ message: "User autenticat", user: req.user });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});