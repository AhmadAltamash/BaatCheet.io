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
        console.log("Sender:", user1);
        console.log("Recipient:", user2);

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

//Upload file
export const uploadFile = async (req, res) => {
    try {
        console.log("Incoming Request: POST /api/messages/upload-file");

        // Ensure a file exists
        if (!req.file) {
            console.error("No file uploaded.");
            return res.status(400).json({ message: "No file uploaded." });
        }

        console.log("Uploaded File Details:", req.file); // Log file details for debugging

        // Force Cloudinary to handle any file type explicitly
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files",
            resource_type: "raw", // Use 'raw' for non-image files
            use_filename: true,
            unique_filename: false,
            overwrite: false,
        });

        console.log("Cloudinary Upload Response:", uploadedResponse);

        if (!uploadedResponse.secure_url) {
            return res.status(500).json({ message: "Failed to upload file to Cloudinary." });
        }

        const user1 = req.userId;
        const user2 = req;

        console.log("Saving to MongoDB:", {
            user2,
            sender: user1,
            recipient: user2,
            fileUrl: uploadedResponse.secure_url,
            fileType: req.file.mimetype,
        });
        
        res.status(200).json({ filePath: uploadedResponse.secure_url });
    } catch (error) {
        console.error("Error during file upload:", error.message);
        res.status(500).json({ message: "Could not upload file", error: error.message });
    }
};

//Download File
export const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await Message.findById(id);

        if (!message || !message.fileUrl) {
            return res.status(404).send("File not found.");
        }

        // Set headers for downloading
        res.set({
            "Content-Type": message.fileType,
            "Content-Disposition": `attachment; filename="${message.fileUrl.split('/').pop()}"`,
        });

        // Redirect to Cloudinary file URL to serve the file
        res.redirect(message.fileUrl);
    } catch (error) {
        console.error("Error downloading file:", error);
        res.status(500).send("Error downloading file.");
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