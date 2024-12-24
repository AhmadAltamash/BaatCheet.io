import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client disconnected: ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()) {
            if(socketId === socket.id) {
                userSocketMap.delete(userId);
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstname lastname image color").populate("recipient", "id email firstname lastname image color");

        if(recipientSocketId) {
            io.to(recipientSocketId).emit("recieveMessage", messageData);
        }
        if(senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User Connnected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log('Unknown user connected');
        }

        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    })
}

export default setupSocket;
// import { Server as SocketIOServer } from "socket.io";
// import Message from "./models/MessagesModel.js";
// import CryptoJS from "crypto-js"; 


// const encrypt = (text) => {
//     const iv = CryptoJS.lib.WordArray.random(16);
//     const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY), {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//     });
//     return JSON.stringify({
//         iv: iv.toString(CryptoJS.enc.Hex),
//         ciphertext: encrypted.toString(),
//     });
// };


// const decrypt = (encryptedText) => {
//     try {
//         const data = JSON.parse(encryptedText);
//         const iv = CryptoJS.enc.Hex.parse(data.iv);
//         const decrypted = CryptoJS.AES.decrypt(data.ciphertext, CryptoJS.enc.Utf8.parse(process.env.SECRET_KEY), {
//             iv: iv,
//             mode: CryptoJS.mode.CBC,
//             padding: CryptoJS.pad.Pkcs7,
//         });
//         return decrypted.toString(CryptoJS.enc.Utf8);
//     } catch (error) {
//         console.error("Decryption error:", error);
//         return null; 
//     }
// };

// const setupSocket = (server) => {
//     const io = new SocketIOServer(server, {
//         cors: {
//             origin: process.env.ORIGIN,
//             methods: ["GET", "POST"],
//             credentials: true
//         }
//     });

//     const userSocketMap = new Map();

//     const disconnect = (socket) => {
//         console.log(`Client disconnected: ${socket.id}`);
//         for (const [userId, socketId] of userSocketMap.entries()) {
//             if (socketId === socket.id) {
//                 userSocketMap.delete(userId);
//                 break;
//             }
//         }
//     };

//     const sendMessage = async (message) => {
//         const senderSocketId = userSocketMap.get(message.sender);
//         const recipientSocketId = userSocketMap.get(message.recipient);
    
        
//         if (message.messageType === "text" && message.content) {
//             message.content = encrypt(message.content);
//         }
    
//         try {
            
//             const createdMessage = await Message.create(message);
//             const messageData = await Message.findById(createdMessage._id)
//                 .populate("sender", "id email firstname lastname image color")
//                 .populate("recipient", "id email firstname lastname image color");
    
            
//             const sanitizedMessage = {
//                 ...messageData.toObject(),
//                 content: decrypt(messageData.content),
//             };
    
//             console.log("Emitting Message:", sanitizedMessage);
    
            
//             if (recipientSocketId) {
//                 io.to(recipientSocketId).emit("recieveMessage", sanitizedMessage);
//             }
//             if (senderSocketId) {
//                 io.to(senderSocketId).emit("recieveMessage", sanitizedMessage);
//             }
//         } catch (error) {
//             console.error("Error sending message:", error);
//         }
//     };

//     io.on("connection", (socket) => {
//         const userId = socket.handshake.query.userId;

//         if (userId) {
//             userSocketMap.set(userId, socket.id);
//             console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
//         } else {
//             console.log("Unknown user connected");
//         }

//         socket.on("sendMessage", sendMessage);
//         socket.on("disconnect", () => disconnect(socket));
//     });
// };

// export default setupSocket;

// return JSON.stringify({
//     iv: iv.toString(CryptoJS.enc.Hex),
//     ciphertext: encrypted.toString(),
// });