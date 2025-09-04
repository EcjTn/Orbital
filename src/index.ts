import http from 'http'
import app from './app.js';
import { Server } from 'socket.io';

// Middlewares
import { socketLoggerEntry } from './socket-middleware/logger.js';
import { requireUsername } from './socket-middleware/require-username.js';

// ChatApp Routes
import { 
    handleDisconnect, 
    handleJoinRoom, 
    handleLeave, 
    handleMessage,
    handleTypedInUsers } from './socket-routes/chat-route.js';

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
chatapp.use(requireUsername)

chatapp.on('connection', (socket) => {

    // For clients thats joining a room
    socket.on('joinRoom', (roomName: string) => handleJoinRoom(socket, chatapp, roomName))

    // Listening for messages - Object specifies where it is sent to
    socket.on('message', (data: IMessageData) => handleMessage(socket, chatapp, data))

    // Listening for disconnects
    socket.on('disconnect', () => handleDisconnect(socket))

    // Listening for leave requests
    socket.on('leaveReq', (roomName: string) => handleLeave(socket, roomName))

    // Listening for typing users
    //Client detects typing and calls this
    socket.on('typedIn', (roomName: string) => handleTypedInUsers(chatapp, socket, roomName))

})






server.listen(8000, () => {
    console.log('*')
})