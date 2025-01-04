import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from '../controllers/AuthController.js'
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles'); // Temporary file storage
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname); // Unique filename
    }
});

const upload = multer({ storage });

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post('/add-profile-image', verifyToken, upload.single("profile-image"), addProfileImage);  // Add profile image
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage);
authRoutes.post("/logout", logout);

export default authRoutes;