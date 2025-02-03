import { io } from "socket.io-client";
import { useState, useEffect } from "react";

import Board from "../components/Board";


export default function JoinRoom() {
    const [roomId, setRoomId] = useState("");
    const [socket, setSocket] = useState(null);
    const [roomJoined, setRoomJoined] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [roomFull, setRoomFull] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState({});

    useEffect(() => {
        // Initialize the socket connection
        const newSocket = io("http://localhost:3001");
        setSocket(newSocket);

        newSocket.on("receiveMessage", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage])
        })
        // Cleanup the socket connection on unmount
        return () => {
            newSocket.disconnect();
        };
    }, []);

    function joinRoom() {
        if (roomId.trim() === "") {
            alert("Please enter a valid room ID.");
            return;
        }

        // Emit an event to the server to create a room
        socket.emit("joinRoom", { roomId });

        // Optionally, listen for a confirmation from the server
        socket.on("roomJoined", (data) => {
            console.log("Room joined successfully:", data);
            setRoomJoined(true);
        });

        socket.on("roomFull", (data) => {
            console.log(`Room ${data} is full`);
            setRoomFull(true);
        })

        socket.on("startGame", ({ players, gameState }) => {
            console.log(players);
            setPlayers(players);
            setGameState(gameState);
            setGameStarted(true);
        })
    }

    function sendMessage() {
        if (message.trim() === "") {
            alert("Empty message");
            return;
        }

        socket.emit("sendMessage", message.trim(), roomId);

        setMessage("");
    }


    return (
        <>
            {
                !roomJoined &&
                <>
                    <h3>Join Room</h3>
                    <input
                        type="text"
                        placeholder="Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join</button>
                </>
            }

            {roomJoined && (
                <>
                    <h4>Welcome {socket.id} to Room {roomId}</h4>





                    {
                        gameStarted &&
                        (

                            <div style={{ display: "flex", margin: "50px", gap: "50px" }}>
                                <Board
                                    socket={socket}
                                    roomId={roomId}
                                    users={players}
                                    state={gameState}
                                />
                                {/* chatbox */}
                                <div>
                                    <div
                                        style={{
                                            border: "1px solid black",
                                            padding: "10px",
                                            height: "200px",
                                            overflowY: "auto",
                                            marginBottom: "10px",
                                        }}
                                    >
                                        {messages.map((msg, index) => (
                                            <p key={index}>{msg}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Type Message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                        />
                                        <button onClick={sendMessage}>Send</button>
                                    </div>
                                </div>
                            </div>
                        )

                    }
                </>
            )}
        </>
    )
}