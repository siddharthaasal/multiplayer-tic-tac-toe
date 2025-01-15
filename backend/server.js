require("dotenv").config();
const express = require("express");
const { Server } = require("socket.io");

const app = express();


app.get("/", function (req, res) {
    res.send("Hello, I am the server of Multiplayer Tic Tac Toe Game!");
})

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, function () {
    console.log("Server spinning on port:", PORT);
})

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // React frontend
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('createRoom', ({ roomId }) => {
        console.log('Request to create room with id: ' + roomId);
        console.log("Room created:" + roomId);
        socket.join(roomId);
        socket.emit("roomCreated", { roomId });
    });

    socket.on('joinRoom', ({ roomId }) => {
        console.log('Request to join room with id: ' + roomId);
        console.log("Room joined:" + roomId);
        socket.join(roomId);
        socket.emit("roomJoined", { roomId });
    });

    //receive a message from frontend and send it to backend
    socket.on("sendMessage", (message, roomId) => {
        console.log(`${message} received from room ${roomId}`);
        io.in(roomId).emit("receiveMessage", message);
    });
});


