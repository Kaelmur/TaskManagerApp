import express, { Router } from "express";
import {
  getUserProfile,
  loginUser,
  registerUser,
  updateUserProfile,
} from "../controller/authController";
import { protect } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";
import { Request, Response } from "express";

const router = Router();

// Auth Routes
router.post("/register", registerUser); // Register user
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User profile
router.put("/profile", protect, updateUserProfile); // Update User Profile

router.post(
  "/upload-image",
  upload.single("image"),
  (req: Request, res: Response): void => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`;
    res.status(200).json({ imageUrl });
  }
);

export default router;
