import axios from "axios";
import { Router } from "express";

const proxyRoutes = Router();

proxyRoutes.get("/proxy-file", async (req, res) => {
    const fileUrl = req.query.url;

    try {
        if (!fileUrl) {
            return res.status(400).json({ message: "File URL is required." });
        }

        if (!fileUrl.startsWith("https://res.cloudinary.com/")) {
            return res.status(400).json({ message: "Invalid file URL." });
        }

        const response = await axios({
            url: fileUrl,
            method: "GET",
            responseType: "arraybuffer",
        });

        const contentType = response.headers["content-type"];
        if (!contentType) {
            console.error("Missing content type:", contentType);
            return res.status(400).json({ message: "Invalid file type." });
        }
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
