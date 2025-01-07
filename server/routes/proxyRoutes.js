import axios from "axios";
import { Router } from "express";

const proxyRoutes = Router();

// Download any file type from Cloudinary
proxyRoutes.get("/proxy-file", async (req, res) => {
    console.log("Received request for proxy-file route");
    const fileUrl = req.query.url;

    try {
        if (!fileUrl) {
            return res.status(400).json({ message: "File URL is required." });
        }

        const response = await axios({
            url: fileUrl,
            method: "GET",
            responseType: "stream",
        });

        // Extract the file name from the URL
        const fileName = decodeURIComponent(fileUrl.split("/").pop());

        // Set headers for file download
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", response.headers["content-type"]);

        // Stream the file to the client
        response.data.pipe(res);
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({ message: "Error fetching file", error: error.message });
    }
});

export default proxyRoutes;
