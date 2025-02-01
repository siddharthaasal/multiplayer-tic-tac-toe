import "../styles/Board.css";
import { useEffect, useState } from "react";

export default function Board({ socket, roomId, users, state }) {

    const [grid, setGrid] = useState(Array(3).fill("").map(() => Array(3).fill("")));
    const [players, setPlayers] = useState(users);
    const [gameState, setGameState] = useState(state);
    const [currentTurn, setCurrentTurn] = useState(gameState.currentTurn);
    const [gameEnded, setGameEnded] = useState(false);
    const [winner, setWinner] = useState(null);

    useEffect(
        () => {
            console.log("Current turn is of player ", players[currentTurn]);
            socket.on("updateGameState", (gameState) => {
                setGrid(gameState.grid);
                setCurrentTurn(gameState.currentTurn);
            })

            socket.on("gameEnded", ({ gameState, winnerIdx }) => {
                setGrid(gameState.grid)
                setGameEnded(true);
                setWinner(players[winnerIdx]);
                setCurrentTurn(-1);

            })

            socket.on("gameDraw", (gameState) => {
                setGrid(gameState.grid);
                setGameEnded(true);
                setCurrentTurn(-1);
            })
        },
        [socket]
    );

    function handleClick(rowIndex, colIndex) {
        if (gameEnded) {
            return;
        }

        if (socket.id !== players[currentTurn]) {
            console.log("Not your turn");
            alert("Not your turn");
            return;
        }
        if (!gameEnded) {
            socket.emit("playerMove", { roomId, rowIndex, colIndex });
        }
    }

    return (
        <>
            <div className="board">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="cell"
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
                {
                    (socket.id === players[currentTurn]) && (
                        <p>Your Turn</p>
                    )
                }

            </div>

            {
                gameEnded && (
                    <h2>{winner ? `Player ${winner} wins!` : "Draw!"}</h2>
                )
            }
        </>
    )
}   