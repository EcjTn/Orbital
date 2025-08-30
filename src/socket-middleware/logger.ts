import { Socket } from "socket.io"

export function socketLoggerEntry(socket: Socket, next: any){
    console.log(`New Socket Joined: ${socket.id}`)
    next()
}