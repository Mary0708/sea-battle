import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Routes, Route } from "react-router-dom";
import AuthScreen from "../../pages/auth-screen/auth-screen";
import NotFoundScreen from "../../pages/not-found-screen/not-found-screen";
import GameScreen from "../../pages/game-screen/game-screen";

export default function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route
          path='/'
          element={<AuthScreen />}
        />
         {/* <Route
          path={AppRoute.Game}
          element={< GameScreen/>}
        /> */}
        <Route
          path="*"
          element={<NotFoundScreen />}
        />
      </Routes>
    </HelmetProvider>
  );
}