import express, { Router, Response, Request } from "express";
import { protect, adminOnly } from "../middlewares/authMiddleware";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getTaskById,
  getTasks,
  getUserDashboardData,
  updateTask,
  updateTaskChecklist,
  updateTaskStatus,
} from "../controller/taskController";
import { uploadFiles } from "../middlewares/uploadMiddleware";
import Task from "../models/Task";

const router = Router();

// Task Management Routes
router.get("/dashboard-data", protect, getDashboardData);
router.get("/user-dashboard-data", protect, getUserDashboardData);
router.get("/", protect, getTasks); // Get all tasks (Admin: all, User: assigned)
router.get("/:id", protect, getTaskById); // Get task by ID
router.post("/", protect, adminOnly, createTask); // Create a task (Admin only)
router.put("/:id", protect, updateTask); // Update task details
router.delete("/:id", protect, adminOnly, deleteTask); // Delete a task (Admin only)
router.put("/:id/status", protect, updateTaskStatus); // Update task status
router.put("/:id/todo", protect, updateTaskChecklist); // Update task checklist

router.post(
  "/:id/upload-files",
  protect,
  uploadFiles.array("attachments", 5),
  async (req: Request, res: Response): Promise<void> => {
    if (!req.files) {
      res.status(400).json({ message: "No files uploaded" });
      return;
    }
    const { id } = req.params;

    try {
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({ message: "Task not found" });
        return;
      }

      const newAttachments = Array.isArray(req.files)
        ? req.files?.map((file: any) => ({
            url: `${req.protocol}://${req.get(
              "host"
            )}/uploads/${encodeURIComponent(file.filename)}`,
            type: file.mimetype.includes("image") ? "image" : "video",
          }))
        : [];

      task.attachments.push(...newAttachments);

      await task.save();

      res.status(200).json({
        message: "Files uploaded successfully",
        task,
      });

      // if (task.status !== "Completed") {
      //   return res.status(400).json({ message: "Task is not completed yet" });
      // }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Error uploading files", error: error.message });
      } else {
        res
          .status(500)
          .json({ message: "Error uploading files", error: "Unknows error" });
      }
    }
  }
);

export default router;
