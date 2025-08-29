import { users } from "../config.js"
import { Socket } from "socket.io";

export function requireUsername(socket: Socket, next: any){
    const socketUsername = socket.handshake.auth.username //Clients passes this property on Connect

    if (!socketUsername || typeof socketUsername !== "string") {
        console.log(`${socket.id} Rejected, no username.`)
        return next(new Error("Username required"))
      }

    users.set(socket.id, socketUsername)
    next()
}