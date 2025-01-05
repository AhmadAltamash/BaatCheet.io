import Message from "../models/MessagesModel.js";
import { v2 as cloudinary } from "cloudinary"; // To interact with Cloudinary for deleting files

export const deleteMessage = async (req, res) => {
    try {
      const { id } = req.params; // Get ID from URL params
  
      // Find the message by ID
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).send({ error: "Message not found" });
      }
  
      // Delete attached file in Cloudinary if it exists
      if (message.fileUrl) {
        const publicId = `chat-app/files/${message.fileUrl.split("/").pop().split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
  
      // Delete the message from the database
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
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded.");
        }

        const allowedMimeTypes = [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "application/pdf", "video/mp4", "application/zip"
        ];

        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).send("Invalid file type.");
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files",
            resource_type: req.file.mimetype.startsWith("image") ? "image" : "auto", // Choose resource type based on file type
        });

        // Save file URL to MongoDB
        const message = new Message({
            sender: req.userId,
            recipient: req.body.recipientId, // Assuming recipientId is passed in the request
            messageType: "file", // Set messageType as 'file'
            fileUrl: result.secure_url, // Cloudinary URL
            timestamp: new Date(),
        });

        await message.save(); // Save to database

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

