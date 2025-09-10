import { Namespace, Socket } from 'socket.io';

import { validateMessageData } from '../validator/client-validation.js';
import { allowedRooms, usernames, users, typingUsers } from "../config.js";

import { IMessageData } from "../interfaces/client-data.js";


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



export function handleTypedInUsers(chatapp: Namespace, socket: Socket, roomName: string): void {

    const typingUsersArray = Array.from(typingUsers)

    if(!roomName || !allowedRooms.includes(roomName)) {
        socket.emit("error", "Action not allowed")
        return
    }

    const socketUsername = users.get(socket.id)
    typingUsers.add(socketUsername as string)

    console.log(`Typing users: ${typingUsersArray}`)
    chatapp.to(roomName).emit("showTyping", typingUsersArray)

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

    const socketUsername: string | undefined = users.get(socket.id)

    if (!socketUsername) return; // user was not registered

    socket.broadcast.emit("leftAnnouncement", `${socketUsername} left`)
    console.log(`${socketUsername} left Public`)

    users.delete(socket.id)
    usernames.delete(socketUsername as string)

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