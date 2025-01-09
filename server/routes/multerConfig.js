import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Shared Multer storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chat-app/files",
        allowed_formats: [
            "jpg", "png", "jpeg", "gif", "pdf", "mp4", "zip",
            "webp", "docx", "xlsx", "txt", "csv", "pptx"
        ], 
        resource_type: "auto", 
    },
});

const upload = multer({ storage });

export default upload;
