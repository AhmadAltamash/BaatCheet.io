import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from '../controllers/AuthController.js'
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-app/profiles',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'],
    },
});

const upload = multer({ storage });

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post('/login', login)
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/add-profile-image', verifyToken, upload.single("profile-image"), addProfileImage)
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)
authRoutes.post("/logout", logout)

export default authRoutes;