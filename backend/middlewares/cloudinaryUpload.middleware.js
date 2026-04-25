import multer from "multer";
import path from "path";

// Use memory storage to store files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/svg+xml"];
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".svg"];

  const ext = path.extname(file.originalname).toLowerCase();

  // Check both mimetype and extension for better compatibility
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    console.log("Rejected file:", file.originalname, file.mimetype, ext);
    cb(new Error("Only image files (jpg, jpeg, png, webp, svg) are allowed"), false);
  }
};

// Multer configuration with memory storage
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
