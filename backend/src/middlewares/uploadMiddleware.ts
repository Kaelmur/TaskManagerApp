import muler from "multer";
import { Request } from "express";
import { FileFilterCallback } from "multer";
import path from "path";

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

export const upload = muler({ storage, fileFilter });
export const uploadFiles = muler({
  storage,
  fileFilter: fileAttachmentsFilter,
});
