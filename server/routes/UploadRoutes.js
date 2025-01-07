// import express from "express";
// import multer from "multer";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// dotenv.config();

// const uploadRoutes = express.Router();

// // Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.CLOUD_API_KEY,
//     api_secret: process.env.CLOUD_API_SECRET,
// });

// // Multer storage for Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "chat-app/uploads",
//         allowed_formats: ["jpg", "png", "jpeg", "gif", "pdf", "mp4", "zip", "webp"],
//     },
// });

// const upload = multer({ storage });

// // Routes for uploads
// uploadRoutes.post("/profile", upload.single("file"), (req, res) => {
//     res.json({ url: req.file.path });
// });

// uploadRoutes.post("/file", upload.single("file"), (req, res) => {
//     res.json({ url: req.file.path });
// });

// export default uploadRoutes;
import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

const uploadRoutes = express.Router();

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Multer storage for Cloudinary
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

// Routes for uploads
uploadRoutes.post("/profile", upload.single("file"), (req, res) => {
    res.json({ url: req.file.path });
});

uploadRoutes.post("/file", upload.single("file"), (req, res) => {
    res.json({ url: req.file.path });
});

export default uploadRoutes;
