import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LobbyPage from './pages/LobbyPage';
import { GameProvider } from './context/GameContext';
import { SocketProvider } from './context/SocketContext';

function App() {
  return (
    <SocketProvider>
      <GameProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/lobby/:roomCode" element={<LobbyPage />} />
              <Route path="/game/:roomCode" element={<GamePage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </SocketProvider>
  );
}

export default App;
