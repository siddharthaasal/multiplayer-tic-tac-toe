import { Outlet, Link } from "react-router-dom";

export default function SinglePlayer() {
    return (
        <>
            <h1>Tic Tac Toe</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/multi-player">Multiplayer</Link>
                    </li>
                </ul>
            </nav>
            <h3>Welcome to single player Tic Tac Toe</h3>
        </>
    )
}