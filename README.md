# Discontinued.

# Realtime Communication Project

A simple real-time chat application built with **Socket.IO** and **TypeScript**, currently under development.

## Features

- Real-time messaging between connected clients.
- Enforces username authentication on connection via a Socket.IO middleware.
- Stores active users using **JavaScript `Map` and `Set`** (all data is temporary/resets on server restart).
- Minimal **Express.js** server included for future expansion (authentication, security, etc.).
- Typing indicators

## Installation 
- Clone the repo
- ```git clone <repo-url>```

- Install dependencies
- ```npm install```

- Compile
- ```npm run compile```

- Run Server
- ```npm start```

## Features

- Username reinforced middleware
- Show typing users
- Basic name validation
- Join/Leave Announcements


## Notes

- Currently, all usernames are reset upon server restart.
- Designed to keep the core simple and lightweight while laying the foundation for future enhancements.
