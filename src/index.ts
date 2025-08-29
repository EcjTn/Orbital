import http from 'http'
import app from './app.js';
import { Server } from 'socket.io';

import { IMessageData } from './interfaces/client-data.js';
import { validateMessageData } from './validator/client-validation.js';
import { socketLoggerEntry } from './socket-middleware/logger.js';

const server = http.createServer(app)

const users = new Map<string, string>()


const io = new Server(server, {
    cors: {
        origin: '*'
    },
    maxHttpBufferSize: 1e6 //1mb
})

io.on('connection', socket => {
    console.log(`${socket.id} Joined on root!`)
})


const allowedRooms:string[] = ['Public', 'Gaming']

// Chat Namespace
const chatapp = io.of('/chat')


// Middlewares
chatapp.use(socketLoggerEntry)


chatapp.on('connection', (socket) => {


    // Clients setting up their Username
    let socketUsername: string | undefined = ''

    socket.on('setUsername', (username: string) => {
        users.set(socket.id, username)
        socketUsername = users.get(socket.id)
    })


    // For clients thats joining a room
    socket.on('joinRoom', (roomName: string) => {

        if(!roomName || !allowedRooms.includes(roomName)){
            socket.emit('error', 'Action not allowed')
            return
        }

        socket.join(roomName)
        console.log(`${socketUsername} Joined ${roomName}`)

        chatapp.to(roomName).emit('joinAnnouncement', `${socketUsername} Joined the room!`) //FE expects this emit
    })


    // Listening for a msgs, but has specific details WHERE it is SENT TO
    socket.on('message', async(data: IMessageData) => {

        const messageData: IMessageData = await validateMessageData(data)
        if(!messageData){
            socket.emit('error', 'Invalid data')
            return
        }

        console.log('Validated:', messageData) //testing purposes

        if(!allowedRooms.includes(messageData.room)) {
            socket.emit('error', 'Action not allowed')
            return
        }
        
        chatapp.to(data.room).emit('message', {
            username: socketUsername,
            message: data.message
        })

    })


    // Listening for disconnects
    socket.on('disconnect', () => {
        socket.broadcast.emit('leftAnnouncement', `${socketUsername} left`)
        console.log(`${socketUsername} left chatapp`)
        users.delete(socket.id)
    })
    

    // Listening for leave
    socket.on('leaveReq', (roomName: string) => {
        if(!roomName || !allowedRooms.includes(roomName)){
            socket.emit('error', 'Action not allowed')
            return
        }

        socket.to(roomName).emit('leftAnnouncement', `${socketUsername} left`)
        socket.leave(roomName)
        console.log(`${socketUsername} Left from ${roomName}`)
    })
    

})






server.listen(8000, () => {
    console.log('*')
})