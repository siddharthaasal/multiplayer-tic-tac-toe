import RoomManager from "./RoomManager.js";

import deotenv from "dotenv";
deotenv.config();
import express from "express";
import { Server } from "socket.io";

const app = express();
const roomManager = new RoomManager();

app.get("/", function (req, res) {
    res.send("Hello, I am the server of Multiplayer Tic Tac Toe Game!");
})

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, function () {
    console.log("Server spinning on port:", PORT);
})

const io = new Server(server, {
    cors: {
        origin: "*", // React frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {

    console.log(`User ${socket.id} connected.`);

    //deprecated
    socket.on('createRoom', ({ roomId }) => {
        console.log('Request to create room with id: ' + roomId);
        socket.join(roomId);
        socket.emit("roomCreated", { roomId });
    });

    socket.on('joinRoom', ({ roomId }) => {

        console.log('Request to join room with id: ' + roomId);

        let room = roomManager.getRoom(roomId);
        if (!room) {
            room = roomManager.createRoom(roomId);
        }

        if (!room.addPlayer(socket.id)) {
            socket.emit("roomFull", { roomId })
            return;
        }

        socket.join(roomId);
        console.log(`Player ${socket.id} has joined the room ${roomId}`)
        io.to(roomId).emit("roomJoined", { roomId }); //improve

        //start if room full
        if (room.numberOfPlayers() === 2) {
            room.initializeGameState();
            console.log(`Room full, start the game`);
            io.to(roomId).emit("startGame", { message: "Game Starting!" });
        }
    });


    socket.on("disconnect", (socket) => {
        console.log(`User ${socket.id} disconnected`);
        //remove the player from the rooms he/she was part in

        for (const roomId in roomManager.rooms) {
            const room = roomManager.getRoom(roomId);
            if (room) {
                room.removePlayer(socket.id);
                console.log(`User ${socket.id} removed from the room ${roomId}`);
                io.to(roomId).emit("playerLeft");
                if (room.numberOfPlayers() === 0) {
                    roomManager.deleteRoom(roomId);
                    console.log(`Room ${roomId} deleted`);
                }
            }
        }
    })

    //receive a message from frontend and send it to backend
    socket.on("sendMessage", (message, roomId) => {
        console.log(`${message} received from room ${roomId}`);
        io.in(roomId).emit("receiveMessage", message);
    });

});


