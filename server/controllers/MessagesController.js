import Message from "../models/MessagesModel.js";
import { v2 as cloudinary } from "cloudinary";

export const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params;
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).send({ error: "Message not found" });
      }
  
      if (message.fileUrl) {
        const publicId = `chat-app/files/${message.fileUrl.split("/").pop().split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
  
      await Message.findByIdAndDelete(id);
  
      res.status(200).send({ message: "Message deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Failed to delete message" });
    }
  };
  


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
        console.log("Incoming Request: POST /api/messages/upload-file");

        // Check if the file exists
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files",
            resource_type: "auto",
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        });

        console.log("Cloudinary Upload Response:", uploadedResponse);

        if (!uploadedResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload file to Cloudinary." });
        }

        res.status(200).json({ filePath: uploadedResponse.secure_url });
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

        // Extract Cloudinary public ID from the URL
        const publicId = `chat-app/files/${fileUrl.split("/").pop().split(".")[0]}`;

        // Log file information for debugging
        console.log("Deleting file with publicId:", publicId);

        // Delete the file from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        res.status(200).send("File deleted successfully.");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting file", error: error.message });
    }
};