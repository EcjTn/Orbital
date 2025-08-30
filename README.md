# Realtime Communication Project

A simple real-time chat application built with **Socket.IO** and **TypeScript**, currently under development.

## Features

- Real-time messaging between connected clients.
- Enforces username authentication on connection via a Socket.IO middleware.
- Stores active users using **JavaScript `Map` and `Set`** (all data is temporary/resets on server restart).
- Minimal **Express.js** server included for future expansion (authentication, security, etc.).

## Installation 
- Clone the repo
```git clone <repo-url>```

- Install deoendencies
```npm install```

- Run Server
```npm start```


## Goals / Roadmap

- Upgrade for full **browser client support**.
- Integrate **Express.js features** such as authentication and security enhancements.
- Implement persistent user storage to survive server restarts.
- Add more advanced chat features (rooms, private messaging, notifications).

## Notes

- Currently, all usernames are reset upon server restart.
- Designed to keep the core simple and lightweight while laying the foundation for future enhancements.
