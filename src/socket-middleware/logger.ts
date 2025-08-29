import { Socket } from "socket.io"

export function socketLoggerEntry(socket: Socket, next: any){
    console.log(`${socket.id} new socket joined`)
    next()
}