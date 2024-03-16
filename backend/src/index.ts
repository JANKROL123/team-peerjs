import express from "express";
import { Server as SocketServer } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import { ExpressPeerServer } from "peer";
const corsOptions = {
    origin: ["http://localhost:5000", "http://localhost:5173"],
    optionsSuccessStatus: 200,
};
const app = express();
const rooms: string[] = [];
app.use(cors(corsOptions));
app.get("/rooms", (_req, res) => {
    return res.send(rooms);
})
const httpServer = createServer(app);
const peerServer = ExpressPeerServer(httpServer, {
    path: "/"
});
app.use(peerServer);
const io = new SocketServer(httpServer, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST"] 
    }
});
io.on("connection", socket => {
    console.log("Connected to WS server");
    socket.on("new-room", (roomId: string) => {
        rooms.push(roomId);
        socket.broadcast.emit("new-room", rooms);
    });
    socket.on("join-room", (roomId, user) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", user);
    });
});

httpServer.listen(5000, () => console.log("Server started on port 5000"));