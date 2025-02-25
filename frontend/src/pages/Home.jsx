import { Outlet, Link } from "react-router-dom";
import JoinRoom from "./JoinRoom";

export default function Home() {
    return (
        <>
            <h1>Tic Tac Toe</h1>
            <JoinRoom />
        </>
    )
}