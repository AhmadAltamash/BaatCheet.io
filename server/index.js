import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/AuthRoutes.js'
import contactsRoutes from './routes/ContactRoutes.js'
import setupSocket from './socket.js'
import messagesRoute from './routes/MessagesRoute.js'
import channelRoutes from './routes/ChannelRoutes.js'
import uploadRoutes from './routes/UploadRoutes.js'
import axios from 'axios';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/';

app.use(cors({
    origin: ["http://localhost:5173"], // Allow multiple origins if needed
    credentials: true, // Enable sending cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));


app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/messages', messagesRoute)
app.use('/api/channels', channelRoutes)
app.use('/api/upload', uploadRoutes)

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

setupSocket(server);

mongoose.connect(databaseURL).then(() => console.log(`MongoDB Connected on ${databaseURL}`)).catch((error)=> console.log(error))

app.get("/proxy-file", async (req, res) => {
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

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${decodeURIComponent(fileUrl.split("/").pop())}"`
        );

        response.data.pipe(res);
    } catch (error) {
        console.error("Error fetching file:", error.message);
        res.status(500).json({ message: "Error fetching file", error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send("Hello, Chat App")
})