import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessagesController.js";
import multer from "multer";
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-app/files',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'mp4', 'zip', 'webp'],
    },
});

const upload = multer({ storage });

const messagesRoute = Router();

messagesRoute.post("/get-messages", verifyToken, getMessages)
messagesRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile)

export default messagesRoute;