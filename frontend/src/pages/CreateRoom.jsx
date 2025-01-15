import { io } from "socket.io-client";
import { useState, useEffect } from "react";

export default function CreateRoom() {
    const [roomId, setRoomId] = useState("");
    const [socket, setSocket] = useState(null);
    const [roomJoined, setRoomJoined] = useState(false);

    useEffect(() => {
        // Initialize the socket connection
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        // Cleanup the socket connection on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    function createRoom() {
        if (roomId.trim() === "") {
            alert("Please enter a valid room ID.");
            return;
        }

        // Emit an event to the server to create a room
        socket.emit("createRoom", { roomId });

        // Optionally, listen for a confirmation from the server
        socket.on("roomCreated", (data) => {
            console.log("Room created & joined successfully:", data);
            setRoomJoined(true);
        });
    }

    return (
        <>
            {
                !roomJoined &&
                <>
                    <h3>Create Room</h3>
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={createRoom}>Create</button>
                </>
            }

            {
                roomJoined &&
                <>
                    <p>Welcome to room {roomId}</p>
                </>
            }
        </>
    );
}
