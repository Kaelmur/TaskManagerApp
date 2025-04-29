import express, { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { getUserById, getUsers } from "../controller/userController";

const router = Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get All Users (admin only)
router.get("/:id", protect, getUserById); // Get a specific User by ID

export default router;
