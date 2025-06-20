import dotenv from "dotenv";
import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./src/config/db";
import authRoutes from "./src/routes/authRoutes";
import userRoutes from "./src/routes/userRoutes";
import taskRoutes from "./src/routes/taskRoutes";
import reportRoutes from "./src/routes/reportRoutes";
import plansRoutes from "./src/routes/planRoutes";
import { errorHandler } from "./src/middlewares/errorMiddleware";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
}

const app: Application = express();

// Middleware to handle CORS
app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://taskmanagerappfront.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect Database
connectDB();

// Middleware
app.use(express.json());

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/plans", plansRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start Server
const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
};

app.listen(config.port, () =>
  console.log(`Server running on port ${config.port}`)
);

// 404 Not Found handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// ERROR HANDLER - always last
app.use(errorHandler);
