import Message from "../models/MessagesModel.js";
import { v2 as cloudinary } from "cloudinary";

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

// Upload file and save in database
const uploadFile = async (req, res) => {
    try {
        console.log("Incoming Request: POST /api/messages/upload-file");

        // Check if the file exists
        if (!req.file) {
            console.log("No file uploaded.");
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Upload the file to Cloudinary
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
            folder: "chat-app/files",
            resource_type: "auto", // Handles all file types
            use_filename: true,    // Use the original file name
            unique_filename: false, // Prevents renaming
            overwrite: false,
        });

        console.log("Cloudinary Upload Response:", uploadedResponse);

        // Check if Cloudinary returned a valid URL
        if (!uploadedResponse.secure_url) {
            console.log("Cloudinary upload failed.");
            return res.status(500).json({ message: "Failed to upload file to Cloudinary." });
        }

        // Respond with the uploaded file URL
        res.status(201).json({
            message: "File uploaded successfully.",
            fileUrl: uploadedResponse.secure_url, // Send the Cloudinary URL
        });
    } catch (error) {
        console.error("Error uploading file:", error.message);
        res.status(500).json({
            message: "Could not upload file",
            error: error.message,
        });
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