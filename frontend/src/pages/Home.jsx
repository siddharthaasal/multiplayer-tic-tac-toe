import { Outlet, Link } from "react-router-dom";

export default function Home() {
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
                    <li>
                        <Link to="/single-player">Solo</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}