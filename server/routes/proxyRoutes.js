import axios from "axios";
import { Router } from "express";

const proxyRoutes = Router();

proxyRoutes.get("/proxy-file", async (req, res) => {
    console.log("Received a request for proxy-file route");
    const fileUrl = req.query.url;

    try {
        if (!fileUrl) {
            return res.status(400).json({ message: "File URL is required." });
        }

        // Allow only Cloudinary URLs
        if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
            return res.status(400).json({ message: "Invalid file URL." });
        }

        console.log("Fetching file from URL...");

        // Fetch file using arraybuffer
        const response = await axios({
            url: fileUrl,
            method: "GET",
            responseType: "arraybuffer",
        });

        console.log("Received response from the file URL");

        // Allow any content type
        const contentType = response.headers["content-type"];
        if (!contentType) {
            console.error("Missing content type:", contentType);
            return res.status(400).json({ message: "Invalid file type." });
        }
        console.log("File Content-Type:", contentType);
        const contentLength = response.headers["content-length"];

        const fileName = decodeURIComponent(fileUrl.split("/").pop());
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Length", contentLength);

        res.send(response.data);
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({
            message: "Error fetching file",
            error: error.message,
        });
    }
});

export default proxyRoutes;
