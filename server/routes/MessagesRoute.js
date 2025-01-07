import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages, uploadFile, deleteFile, deleteMessage } from "../controllers/MessagesController.js";
import upload from "./multerConfig.js";

const messagesRoute = Router();

messagesRoute.post("/get-messages", verifyToken, getMessages);
messagesRoute.post("/upload-file", verifyToken, upload.single("file"), uploadFile);
messagesRoute.delete("/delete-file/:id", verifyToken, deleteFile);
messagesRoute.delete("/delete-message/:id", verifyToken, deleteMessage);

export default messagesRoute;
