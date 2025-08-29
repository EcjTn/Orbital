import http from 'http'
import app from './app.js';
import { Server } from 'socket.io';

import { socketLoggerEntry } from './socket-middleware/logger.js';

// ChatApp Routes
import { handleDisconnect, handleJoinRoom, handleLeave, handleMessage, handleSetUsername } from './socket-routes/chat-route.js';

//Interfaces -- if confused with data shapes
import { IMessageData } from './interfaces/client-data.js';



const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: '*'
    },
    maxHttpBufferSize: 1e6 //1mb
})

io.on('connection', socket => {
    console.log(`${socket.id} Joined on root!`)
})


// Chat Namespace
const chatapp = io.of('/chat')


// Middlewares
chatapp.use(socketLoggerEntry)


chatapp.on('connection', (socket) => {


    // Clients setting up their Username
    socket.on('setUsername', (username: string) => handleSetUsername(socket, username))

    // For clients thats joining a room
    socket.on('joinRoom', (roomName: string) => handleJoinRoom(socket, chatapp, roomName))

    // Listening for messages - Object specifies where it is sent to
    socket.on('message', (data: IMessageData) => handleMessage(socket, chatapp, data))

    // Listening for disconnects
    socket.on('disconnect', () => handleDisconnect(socket))

    // Listening for leave requests
    socket.on('leaveReq', (roomName: string) => handleLeave(socket, roomName))

})






server.listen(8000, () => {
    console.log('*')
})