import { usernames, users } from "../config.js"
import { Socket } from "socket.io";

export function requireUsername(socket: Socket, next: any){
    const socketUsername: string = socket.handshake.auth.username //Clients passes this property on Connect

    if (!socketUsername || typeof socketUsername !== "string") {
        console.log(`${socket.id} Rejected, no username.`)
        return next(new Error("Username required"))
      }

    if(usernames.has(socketUsername)){
      console.log(`${socket.id} Rejected: username already exists`)
      return next(new Error("Username already exists!"))
    }

    users.set(socket.id, socketUsername)
    usernames.add(socketUsername)
    next()
}