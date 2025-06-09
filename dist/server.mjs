"use strict";
import next from 'next';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = createServer(handle);
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        socket.on('joinRoom', ({ room, userName }) => {
            socket.join(room);
            console.log(`${userName} joined room: ${room}`);
            socket.to(room).emit('message', {
                isSystemMessage: true,
                isOwnMessage: false,
                message: `${userName} has joined the room.`,
                userName: 'System',
            });
        });
        socket.on('sendMessage', ({ room, message, userName }) => {
            console.log(`Message from ${userName} in room ${room}:`, message);
            socket.to(room).emit('message', {
                isSystemMessage: false,
                isOwnMessage: socket.id === userName,
                message,
                userName,
            });
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
}).catch((err) => {
    console.error('Error starting the server:', err);
    process.exit(1);
});
