import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile, deleteFile, deleteMessage } from "../controllers/MessagesController.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "chat-app/uploads",
        allowed_formats: [
            "jpg", "png", "jpeg", "gif", "pdf", "mp4", "zip",
            "webp", "docx", "xlsx", "txt", "csv", "pptx"
        ], // Expanded allowed formats
    },
});

const upload = multer({ storage });

const messagesRoute = Router();

// Routes
messagesRoute.post("/get-messages", verifyToken, getMessages);
messagesRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
messagesRoute.delete("/delete-file/:id", verifyToken, deleteFile); // Added delete file route
messagesRoute.delete("/delete-message/:id", verifyToken, deleteMessage);

export default messagesRoute;
