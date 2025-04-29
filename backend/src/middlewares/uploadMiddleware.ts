import muler from "multer";
import { Request } from "express";
import { FileFilterCallback } from "multer";

interface MulterFile extends Express.Multer.File {}

// Configure storage
const storage = muler.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req: Request, file: MulterFile, cb: FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png formats are allowed"));
  }
};

export const upload = muler({ storage, fileFilter });
