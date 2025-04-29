import express, { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import {
  exportTasksReport,
  exportUsersReport,
} from "../controller/reportController";

const router = Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); // Export all tasks as Excel/PDF
router.get("/export/users", protect, adminOnly, exportUsersReport); // Export user-task report

export default router;
