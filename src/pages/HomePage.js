import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import './HomePage.css';

const HomePage = () => {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isStartingSolo, setIsStartingSolo] = useState(false);
  const [error, setError] = useState('');
  const { socket, isConnected, createRoom, joinRoom, roomData, gameData, error: socketError } = useSocket();
  const navigate = useNavigate();

  // Handle navigation when room is created or joined
  useEffect(() => {
    if (roomData) {
      console.log('HomePage: Room data received:', roomData);
      console.log('HomePage: isSolo flag:', roomData.isSolo);
      console.log('HomePage: roomCode:', roomData.roomCode);
      console.log('HomePage: players:', roomData.players);
      
      setIsCreating(false);
      setIsJoining(false);
      setIsStartingSolo(false);
      
      if (roomData.isSolo) {
        // For solo games, navigate directly to game (skip lobby)
        console.log('HomePage: Solo game detected, navigating directly to game');
        const navigationState = { 
          roomCode: roomData.roomCode, 
          playerName: playerName,
          isSolo: true 
        };
        console.log('HomePage: Navigation state:', navigationState);
        navigate(`/game/${roomData.roomCode}`, { state: navigationState });
      } else {
        // For multiplayer games, navigate to lobby
        console.log('HomePage: Multiplayer game detected, navigating to lobby');
        navigate(`/lobby/${roomData.roomCode}`, { 
          state: { 
            roomCode: roomData.roomCode, 
            playerName: playerName,
            isHost: roomData.players.length === 1
          } 
        });
      }
    }
  }, [roomData, navigate, playerName]);

  // Handle socket errors
  useEffect(() => {
    if (socketError) {
      setError(socketError);
      setIsCreating(false);
      setIsJoining(false);
      setIsStartingSolo(false);
    }
  }, [socketError]);

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsCreating(true);
    setError('');
    
    createRoom(playerName.trim());
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) {
      setError('Please enter both name and room code');
      return;
    }
    
    setIsJoining(true);
    setError('');
    
    joinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  const handleSoloPlay = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }
    
    setIsStartingSolo(true);
    setError('');
    
    console.log('Starting solo play for player:', playerName.trim());
    // Create a solo room using the SocketContext function
    createRoom(playerName.trim(), 3, true); // 3 rounds for solo play, isSolo = true
  };

  // Handle solo game start when room is created
  useEffect(() => {
    if (roomData && roomData.isSolo && socket && !gameData) {
      // For solo games, start the game immediately after room creation
      console.log('Starting solo game for room:', roomData.roomCode);
      socket.emit('startGame', { roomCode: roomData.roomCode }, (startResponse) => {
        if (startResponse.success) {
          console.log('Solo game started successfully');
          // Game will start automatically, no need for additional navigation
        } else {
          console.error('Failed to start solo game:', startResponse.error);
          setError('Failed to start solo game: ' + startResponse.error);
          setIsStartingSolo(false);
        }
      });
    }
  }, [roomData, socket, gameData]);



  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">Wordament Multiplayer</h1>
          <p className="home-subtitle">Find words, score points, compete with friends!</p>
        </div>

        <div className="connection-status">
          {isConnected ? (
            <span className="status-connected">✓ Connected to server</span>
          ) : (
            <span className="status-disconnected">✗ Disconnected from server</span>
          )}
        </div>

        <div className="home-form">
          <div className="form-group">
            <label htmlFor="playerName">Your Name:</label>
            <input
              type="text"
              id="playerName"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="game-options">
            <div className="option-section">
              <h3>Multiplayer</h3>
              <div className="option-buttons">
                <button 
                  className="btn btn-primary" 
                  onClick={handleCreateRoom}
                  disabled={isCreating || !isConnected}
                >
                  {isCreating ? 'Creating...' : 'Create Room'}
                </button>
                
                <div className="join-section">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value)}
                    placeholder="Enter room code"
                    maxLength={8}
                    className="room-code-input"
                  />
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleJoinRoom}
                    disabled={isJoining || !isConnected}
                  >
                    {isJoining ? 'Joining...' : 'Join Room'}
                  </button>
                </div>
              </div>
            </div>

            <div className="option-divider">
              <span>OR</span>
            </div>

            <div className="option-section">
              <h3>Solo Play</h3>
              <p className="solo-description">Practice and play by yourself</p>
              <button 
                className="btn btn-solo" 
                onClick={handleSoloPlay}
                disabled={isStartingSolo || !isConnected}
              >
                {isStartingSolo ? 'Starting...' : 'Play Solo'}
              </button>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default HomePage; 