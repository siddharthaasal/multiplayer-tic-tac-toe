import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SinglePlayer from "../src/pages/SinlgePlayer";
import MultiPlayer from "./pages/MultiPlayer";
import Home from "../src/pages/Home";
import JoinRoom from "../src/pages/JoinRoom";

const App = () => {

  return (
    <>
      <Home />
    </>
  );
};

export default App;
