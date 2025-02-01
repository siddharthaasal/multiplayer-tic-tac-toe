import { Outlet, Link } from "react-router-dom";

export default function MultiPlayer() {
    return (
        <>
            <h1>Tic Tac Toe</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/single-player">Solo</Link>
                    </li>
                </ul>
            </nav>
            <h3>Welcome to Multiplayer Tic Tac Toe</h3>
            <nav>
                <ul>
                    <li>
                        <Link to="/join-room">Join Room</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}