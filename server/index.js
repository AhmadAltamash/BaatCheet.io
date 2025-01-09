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
import proxyRoutes from './routes/proxyRoutes.js'

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;
const databaseURL = process.env.DATABASE_URL || 'mongodb://localhost:27017/';

app.use(cors({
    origin: process.env.ORIGIN || ["http://baat-cheet-io.vercel.app/"],
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));


// app.use("/uploads/profiles", express.static("uploads/profiles"));
// app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.use('/api', proxyRoutes)
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

app.get('/', (req, res) => {
    res.send("Hello, Chat App")
});
