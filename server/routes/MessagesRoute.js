import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import { getMessages } from "../controllers/MessagesController.js";

const messagesRoute = Router();

messagesRoute.post("/get-messagese", verifyToken, getMessages)

export default messagesRoute;