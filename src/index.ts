import http from 'http'
import app from './app.js';
import { Server } from 'socket.io';
import { IMessageData } from './interfaces/client-data.js';

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

chatapp.on('connection', (socket) => {

    // Clients setting up their Username
    let socketUsername: string | undefined = ''
    console.log(`${socket.id} Joined chatapp/`)

    socket.on('setUsername', (username: string) => {
        users.set(socket.id, username)
        socketUsername = users.get(socket.id)
    })

    // For clients thats joining a room
    socket.on('joinRoom', roomName => {

        if(!roomName || !allowedRooms.includes(roomName)){
            socket.emit('error', 'Action not allowed')
            return
        }

        socket.join(roomName)
        console.log(`${socketUsername} Joined ${roomName}`)

        chatapp.to(roomName).emit('announcement', `${socketUsername} Joined the room!`) //FE expects this emit
    })

    // Listening for a msgs, but has specific details WHERE it is SENT TO
    socket.on('message', (data: IMessageData) => {
        if(data)

        console.log(`${socketUsername}: ${data.message} --> ${data.room}`)

        chatapp.to(data.room).emit('message', {
            username: socketUsername,
            message: data.message
        })

    })
    
})
































server.listen(8000, () => {
    console.log('*')
})