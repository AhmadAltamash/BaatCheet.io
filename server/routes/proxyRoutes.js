import { Router } from 'express'

const proxyRoutes = Router()

proxyRoutes.get("/proxy-file", async (req, res) => {
    const fileUrl = req.query.url;
  
    console.log(fileUrl)
  
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
            responseType: "stream",
        });
  
        // Check if content-type is valid (e.g., image/*)
        const contentType = response.headers["content-type"];
        if (!contentType.startsWith("image") && !contentType.startsWith("application")) {
            console.error("Invalid content type:", contentType);
            return res.status(400).json({ message: "Invalid file type." });
        }
  
        // Log the content type for debugging
        console.log("Content-Type:", contentType);
  
        // Set headers for file download
        const fileName = decodeURIComponent(fileUrl.split("/").pop());
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", contentType); 
  
        response.data.pipe(res); // Pipe the file to the response
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({ message: "Error fetching file", error: error.message });
    }
  });


export default proxyRoutes;