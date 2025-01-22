import Room from "./Room.js";

export default class RoomManager {

    constructor() {
        this.rooms = {};
    }

    createRoom(roomId) {
        if (!this.rooms[roomId]) {
            this.rooms[roomId] = new Room(roomId);
            console.log(`Room ${roomId} created.`);
        }
        return this.rooms[roomId];
    }

    deleteRoom(roomId) {
        delete this.rooms[roomId];
        console.log(`Room ${roomId} deleted.`)
    }

    getRoom(roomId) {
        return this.rooms[roomId];
    }
}


