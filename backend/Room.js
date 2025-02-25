export default class Room {
    constructor(roomId) {
        this.roomId = roomId;
        this.players = [];
        this.gameState = null;
    }

    addPlayer(socketId) {
        if (this.players.some((player) => player === socketId)) {
            console.log(`Player ${socketId} already in the room.`);
            return false; // Prevent duplicate entries
        }

        if (this.numberOfPlayers() < 2) {
            console.log(`Player ${socketId} added to room ${this.roomId}.`);
            this.players.push(socketId);

            // Initialize game state if both players are present
            if (this.numberOfPlayers() === 2 && !this.gameState) {
                this.initializeGameState();
            }

            return true;
        } else {
            console.log(`Room ${this.roomId} is full.`);
            return false;
        }
    }


    removePlayer(socketId) {
        this.players = this.players.filter((player) => player !== socketId)
        console.log(`Player ${socketId} removed from room ${this.roomId}.`);
        console.log("Number of players now: ", this.numberOfPlayers());
        if (this.numberOfPlayers() === 0) {
            console.log(`Room ${this.roomId} is now empty.`);
            // Consider removing the room from a global rooms list
        }
    }

    numberOfPlayers() {
        return this.players.length;
    }

    getPlayers() {
        return this.players;
    }

    getGameState() {
        return this.gameState;
    }

    initializeGameState() {
        this.gameState = {
            grid: Array(3).fill("").map(() => Array(3).fill("")),
            currentTurn: this.toss(),
        };
    }

    updateGameState(gameState) {
        this.gameState = gameState;
    }

    toss() {
        let i = Math.floor(Math.random() * 2);
        return i
    }

}

