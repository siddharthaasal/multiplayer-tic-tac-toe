import "../styles/Board.css";
import { useState } from "react";

export default function Board(props) {

    const [grid, setGrid] = useState(Array(3).fill("").map(() => Array(3).fill("")));
    const [players, setPlayers] = useState(props.players);
    const [gameState, setGameState] = useState(props.gameState);
    const [currentPlayerIdx, setCurrentPlayerIdx] = useState(props.gameState.currentTurn);
    const [currentSymbol, setCurrentSymbol] = useState("X");
    const [numberOfTurns, setNumberOfTurns] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    const [winnerIdx, setWinnerIdx] = useState(-1);

    function handleClick(rowIndex, colIndex) {
        if (grid[rowIndex][colIndex] != "") {
            alert("Invalid Move")
            return;
        }
        if (gameEnded) {
            alert("Game Ended")
            return;
        }

        //the cell is empty
        const newGrid = grid.map((row, rIdx) =>
            row.map((cell, cIdx) =>
                (rIdx === rowIndex && cIdx === colIndex) ? currentSymbol : cell
            )
        );
        setGrid(newGrid);
        console.log(newGrid);
        setNumberOfTurns((prevTurns) => prevTurns + 1);
        checkWinner(newGrid);
        checkDraw();
        hasGameEnded();
        setCurrentSymbol(toggleCurrentSymbol);
        setCurrentPlayerIdx(toggleCurrentPlayerIdx);
    }

    function toggleCurrentSymbol() {
        (currentSymbol === "X") ? setCurrentSymbol("O") : setCurrentSymbol("X");
    }

    function toggleCurrentPlayerIdx() {
        (currentPlayerIdx === 0) ? setCurrentPlayerIdx(1) : setCurrentPlayerIdx(0);
    }

    function hasGameEnded() {
        if (numberOfTurns === 9) {
            setGameEnded(true);
        }
    }

    function checkWinner(grid) {
        //winning lines
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
        for (let line of winningLines) {
            if (line.every((cell) => cell === "X") || line.every((cell) => cell === "O")) {
                console.log("Winner!")
                setGameEnded(true);
                console.log(`Player ${players[currentPlayerIdx]} wins!`);
                setWinnerIdx(currentPlayerIdx);
            }
        }
    }


    function checkDraw() {
        if (!gameEnded && numberOfTurns === 9) {
            console.log("It's a draw!");
            setGameEnded(true);
            setWinnerIdx(-1);
        }
    }

    return (
        <>
            <div className="board">
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`} className="cell"
                            onClick={() => handleClick(rowIndex, colIndex)}>
                            {cell}
                        </div>
                    ))
                )}
            </div >
            {gameEnded && (
                <h1>
                    {winnerIdx === -1
                        ? "It's a draw!"
                        : `Winner!`
                    }
                    {/* Player ${players[winnerIdx]} (${winnerIdx === 0 ? "X" : "O"}) wins!`} */}
                </h1>
            )}
        </>
    )
}   