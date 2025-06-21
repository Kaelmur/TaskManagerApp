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
import cloudinary from "../../utils/cloudinary";
import fs from "fs";

const router = Router();

// Auth Routes
router.post("/register", registerUser); // Register user
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); // Get User profile
router.put("/profile", protect, updateUserProfile); // Update User Profile

router.post(
  "/upload-image",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    try {
      const result = await cloudinary.uploader
        .upload_stream(
          {
            folder: "uploads",
            resource_type: "image",
          },
          (error, result) => {
            if (error)
              return res.status(500).json({ message: "Upload failed" });
            res.status(200).json({ imageUrl: result?.secure_url });
          }
        )
        .end(req.file.buffer);
    } catch (error) {
      console.error("Upload to Cloudinary failed:", error);
      res.status(500).json({ message: "Cloudinary upload failed" });
    }
  }
);

export default router;
