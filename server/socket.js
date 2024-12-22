import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    })

    const userSocketMap = new Map();

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if(userId) {
            userSocketMap.set(userId, socket.id);
        }
    })
}

export default setupSocket;