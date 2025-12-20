// config/multerConfig.ts

import multer, { Multer } from "multer";
import path from "path";
import fs from "fs";

// Define the directory for image storage
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

// Ensure the directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log(`Created upload directory: ${UPLOAD_DIR}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Saves the file to the dedicated folder
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: fieldname-timestamp-random.ext
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Create the Multer instance. We export the upload middleware.
const upload: Multer = multer({ storage: storage });

export default upload;
