import muler from "multer";
import { Request, Response, NextFunction } from "express";
import { FileFilterCallback } from "multer";
import path from "path";
import cloudinary from "../../utils/cloudinary";
import fs from "fs";

interface MulterFile extends Express.Multer.File {}

type CloudinaryFile = Express.Multer.File & {
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
};

// Configure storage
const storage = muler.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for avatars
const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"));
  }
};

const fileAttachmentsFilter = (
  req: Request,
  file: MulterFile,
  cb: FileFilterCallback
) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|avi|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images and videos are allowed."));
  }
};

const cleanupLocalFile = (filePath: string) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error("Error deleting local file:", err);
  });
};

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!Array.isArray(req.files) || req.files.length === 0) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const files = req.files as CloudinaryFile[];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "uploads",
        resource_type: "auto",
      });

      file.cloudinaryUrl = result.secure_url;
      file.cloudinaryPublicId = result.public_id;

      cleanupLocalFile(file.path);
    }

    // Proceed to next middleware or route handler
    next();
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Error uploading to Cloudinary" });
  }
};

export const upload = muler({ storage, fileFilter });
export const uploadFiles = muler({
  storage,
  fileFilter: fileAttachmentsFilter,
});
