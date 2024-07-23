import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import authRoutes from './Routes/authRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import messageRoutes from './Routes/messageRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const allowedOrigins = ['http://localhost:5173', 'https://chatbox-lilac-five.vercel.app'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(cors({ origin: allowedOrigins, credentials: true }));

main().catch(err=>{
  console.log(err)
})
app.use(express.json());
app.use('/backend/auth', authRoutes);
app.use('/backend/users', userRoutes);
app.use('/backend/message', messageRoutes);
app.use('/public', express.static('public'));
const userSocketMap ={}
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  const userId=socket.handshake.query.userId;
  if(userId){
    userSocketMap[userId]=socket.id;
  }
  io.emit("getOnlineUsers",Object.keys(userSocketMap))
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
  });
});
export const getReceiverSocketId= (receiverId)=>{
     return userSocketMap[receiverId];
}
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

const port = process.env.PORT || 8800;
server.listen(port, () => {
  console.log(`Server is running on: ${port}`);
});
