import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import {Server} from 'socket.io';
import './config/db.js';
import { userRouter } from './routes/userRoute.js';
import { messageRouter } from './routes/messageRoute.js';

// Create express app and hhtp server
const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
	cors: {origin: "*"}
})

export const userSocketMap = {}; //{userId: socketId}

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	console.log("User Connected", userId)

	if(userId){
		userSocketMap[userId] = socket.id;
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("User Disconnected", userId);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	})
})

//Middleware setup
app.use(express.json({limit: "4mb"}));
app.use(cors());

app.use("/api/status", (req, res) => res.send("server is working"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT))