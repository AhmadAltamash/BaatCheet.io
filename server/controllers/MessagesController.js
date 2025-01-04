import Message from "../models/MessagesModel.js";
import { v2 as cloudinary } from "cloudinary";

// Get messages
export const getMessages = async (req, res) => {
    try {
        const user1 = req.userId;
        const user2 = req.body.id;

        if (!user1 || !user2) {
            return res.status(400).send("Both users are required.");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipient: user2 },
                { sender: user2, recipient: user1 }
            ]
        }).sort({ timestamp: 1 });

        res.status(200).json({ messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not fetch messages", error: error.message });
    }
};

// Upload file
export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files",
            resource_type: "auto",
        });

        res.status(200).json({ filePath: result.secure_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Could not upload file", error: error.message });
    }
};

// Delete file
export const deleteFile = async (req, res) => {
    try {
        const { fileUrl } = req.body;

        if (!fileUrl) {
            return res.status(400).send("File URL is required.");
        }

        const publicId = fileUrl.split("/").pop().split(".")[0]; // Extract Cloudinary public_id
        await cloudinary.uploader.destroy(`chat-app/files/${publicId}`);

        res.status(200).send("File deleted successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting file", error: error.message });
    }
};
