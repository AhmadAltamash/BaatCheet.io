import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const uploadRoutes = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-app/uploads',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'pdf', 'mp4', 'zip', 'webp'],
    },
});

const upload = multer({ storage });


uploadRoutes.post('/profile', upload.single('file'), (req, res) => {
    res.json({ url: req.file.path });
});


uploadRoutes.post('/file', upload.single('file'), (req, res) => {
    res.json({ url: req.file.path });
});

export default uploadRoutes;
