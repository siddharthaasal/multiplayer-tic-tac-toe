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


    socket.on('joinRoom', ({ roomId }) => {

        console.log('Request to join room with id: ' + roomId);
        let room = roomManager.getRoom(roomId);
        if (!room) {
            room = roomManager.createRoom(roomId);
        }

        if (!room.addPlayer(socket.id)) {
            console.log(`Cannot add player ${socket.id} in room ${roomId} because it is already full :(`);
            socket.emit("roomFull", { roomId })
            return;
        }

        socket.join(roomId);
        console.log("After joining Rooms in the Room Manager class: ", roomManager.rooms);
        // roomManager.rooms.push(room);
        console.log(`Player ${socket.id} has joined the room ${roomId}`)
        io.to(roomId).emit("roomJoined", { roomId }); //improve

        //start if room full
        if (room.numberOfPlayers() === 2) {
            room.initializeGameState();
            console.log(`Room full, start the game`);
            let players = room.getPlayers();
            let gameState = room.getGameState();
            io.to(roomId).emit("startGame", { players, gameState });
        }
    });

    socket.on('playerMove', ({ roomId, rowIndex, colIndex }) => {
        let room = roomManager.getRoom(roomId);
        if (!room) {
            console.log("Invalid Room Id");
            return;
        }

        // Ensure the game state is initialized
        let gameState = room.getGameState();
        if (!gameState) {
            console.log("Game state is uninitialized for this room.");
            return;
        }

        // Check for invalid move
        if (rowIndex > 2 || colIndex > 2 || rowIndex < 0 || colIndex < 0) {
            console.log("Invalid Move: Out of bounds");
            return;
        }
        if (gameState.grid[rowIndex][colIndex] !== "") {
            console.log("Invalid Move: Cell already occupied");
            return;
        }

        // All good, process the move
        console.log("Grid before move:", gameState.grid);

        let symbol = gameState.currentTurn == 0 ? "X" : "O";
        gameState.grid[rowIndex][colIndex] = symbol;
        gameState.currentTurn = 1 - gameState.currentTurn;
        room.updateGameState(gameState);

        console.log("Grid after move:", gameState.grid);
        if (checkWinner(gameState.grid) === "winner") {
            let winnerIdx = 1 - gameState.currentTurn;
            io.to(roomId).emit("gameEnded", { gameState, winnerIdx });
        } else if (checkWinner(gameState.grid) === "draw") {
            io.to(roomId).emit("gameDraw", gameState);
        } else {
            io.to(roomId).emit("updateGameState", gameState);
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


//helper functions

function checkWinner(grid) {
    const winningLines = [
        // Rows
        [grid[0][0], grid[0][1], grid[0][2]],
        [grid[1][0], grid[1][1], grid[1][2]],
        [grid[2][0], grid[2][1], grid[2][2]],
        // Columns
        [grid[0][0], grid[1][0], grid[2][0]],
        [grid[0][1], grid[1][1], grid[2][1]],
        [grid[0][2], grid[1][2], grid[2][2]],
        // Diagonals
        [grid[0][0], grid[1][1], grid[2][2]],
        [grid[0][2], grid[1][1], grid[2][0]],
    ];

    // Check if there's a winner
    if (winningLines.some(line => line.every(cell => cell === "X") || line.every(cell => cell === "O"))) {
        return "winner";
    }

    // Check for draw: If all cells are filled and no winner
    if (grid.flat().every(cell => cell !== "")) {
        return "draw";
    }

    return null; // Game still ongoing
}
