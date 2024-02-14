import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "../../pages/login";
import GameScreen from "../../pages/game";
import './app.css'

export default function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Login />}
        />
        <Route path="/game">
          <Route path=':gameId' element={< GameScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}