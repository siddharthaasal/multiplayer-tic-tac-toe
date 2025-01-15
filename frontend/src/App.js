import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SinglePlayer from "../src/pages/SinlgePlayer";
import MultiPlayer from "./pages/MultiPlayer";
import Home from "../src/pages/Home";
import CreateRoom from "../src/pages/CreateRoom";
import JoinRoom from "../src/pages/JoinRoom";

const App = () => {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/multi-player" element={<MultiPlayer />}></Route>
          <Route path="/single-player" element={<SinglePlayer />}></Route>
          <Route path="/create-room" element={<CreateRoom />}></Route>
          <Route path="/join-room" element={<JoinRoom />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
