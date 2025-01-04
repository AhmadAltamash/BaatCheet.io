import { mkdirSync, renameSync } from "fs";
import Message from "../models/MessagesModel.js";

export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if(!user1 || !user2){
            return res.status(400).send("Both user are Required")
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 })

        return res.status(200).json({ messages })
    } catch (error) {
        console.log({ error });
        return res.status(500).json({ message: "Could Not fetch messages", error: error.message });
    }
};


export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files", 
            resource_type: "auto",
        });

        return res.status(200).json({ filePath: result.secure_url });
    } catch (error) {
        console.log({ error });
        return res.status(500).json({
            message: "Could not upload file",
            error: error.message,
        });
    }
};
