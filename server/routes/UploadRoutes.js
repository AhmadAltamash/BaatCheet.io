import express from "express";
import upload from "./multerConfig.js";

const uploadRoutes = express.Router();

uploadRoutes.post("/profile", upload.single("file"), (req, res) => {
    res.json({ url: req.file.path });
});

uploadRoutes.post("/file", upload.single("file"), (req, res) => {
    res.json({ url: req.file.path });
});

export default uploadRoutes;
