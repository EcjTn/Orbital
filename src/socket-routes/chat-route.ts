import { Namespace, Socket } from 'socket.io';

import { validateMessageData } from '../validator/client-validation.js';
import { allowedRooms, users } from "../config.js";

import { IMessageData } from "../interfaces/client-data.js";



export function handleSetUsername(socket: Socket, username: string) { 
    users.set(socket.id, username)
}



export function handleJoinRoom(socket: Socket, chatapp: Namespace, roomName: string) {
    const socketUsername = users.get(socket.id)

    if (!roomName || !allowedRooms.includes(roomName)) {
        socket.emit("error", "Action not allowed")
        return
    }

    socket.join(roomName)
    console.log(`${socketUsername} Joined ${roomName}`)

    chatapp.to(roomName).emit("joinAnnouncement", `${socketUsername} Joined the room!`)
}



export async function handleMessage(socket: Socket, chatapp: Namespace, data: IMessageData) {
    const socketUsername = users.get(socket.id)
    const messageData: IMessageData = await validateMessageData(data)

    if (!messageData) {
        socket.emit("error", "Invalid data")
        return
    }

    if (!allowedRooms.includes(messageData.room)) {
        socket.emit("error", "Action not allowed")
        return
    }

    chatapp.to(messageData.room).emit("message", {
        username: socketUsername,
        message: messageData.message,
    })
}



export function handleDisconnect(socket: Socket) {
    const socketUsername = users.get(socket.id)

    socket.broadcast.emit("leftAnnouncement", `${socketUsername} left`)
    console.log(`${socketUsername} left chatapp`)

    users.delete(socket.id)
}



export function handleLeave(socket: Socket, roomName: string) {
    const socketUsername = users.get(socket.id)

    if (!roomName || !allowedRooms.includes(roomName)) {
        socket.emit("error", "Action not allowed")
        return
    }

    socket.to(roomName).emit("leftAnnouncement", `${socketUsername} left`)
    socket.leave(roomName)
    console.log(`${socketUsername} Left from ${roomName}`)
}