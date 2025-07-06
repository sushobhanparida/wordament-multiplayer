import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import '../styles/LobbyPage.css';

const LobbyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const { playerName, isHost } = location.state || {};
  const { roomData, gameData, startGame, isConnected } = useSocket();
  
  const [players, setPlayers] = useState([]);
  const [currentRoomCode] = useState(roomCode || location.state?.roomCode);

  useEffect(() => {
    if (!playerName || !currentRoomCode) {
      navigate('/');
      return;
    }

    if (!isConnected) {
      navigate('/');
      return;
    }

    // Update players when roomData changes
    if (roomData && roomData.players) {
      console.log('LobbyPage: Setting players from roomData:', roomData.players);
      // Ensure players is an array and filter out non-string values
      const validPlayers = Array.isArray(roomData.players) 
        ? roomData.players.filter(player => typeof player === 'string')
        : [];
      setPlayers(validPlayers);
    }
  }, [playerName, currentRoomCode, navigate, isConnected, roomData]);

  useEffect(() => {
    // Navigate to game when gameData is available (game started)
    if (gameData) {
      navigate(`/game/${currentRoomCode}`, { 
        state: { 
          roomCode: currentRoomCode, 
          playerName: playerName,
          isHost 
        } 
      });
    }
  }, [gameData, navigate, currentRoomCode, playerName, isHost]);

  const handleStartGame = () => {
    console.log('Starting game with:', { isHost, players: players.length, roomCode: currentRoomCode });
    if (isHost && players.length >= 2) {
      console.log('Calling startGame()');
      startGame(currentRoomCode);
    } else {
      console.log('Cannot start game:', { isHost, playerCount: players.length });
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(currentRoomCode);
    alert('Room code copied to clipboard!');
  };

  if (!playerName || !currentRoomCode) {
    return null;
  }

  return (
    <div className="lobby-page">
      <div className="lobby-container">
        <h1>Game Lobby</h1>
        <div className="room-info">
          <h2>Room Code: {currentRoomCode}</h2>
          <button onClick={copyRoomCode} className="btn btn-secondary">
            Copy Code
          </button>
        </div>

        <div className="players-list">
          <h3>Players ({players.length})</h3>
          <div className="players-grid">
            {players.map((player, index) => (
              <div key={index} className="player-card">
                <div className="player-avatar">
                  {typeof player === 'string' && player.length > 0 ? player.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="player-info">
                  <span className="player-name">{player || 'Unknown Player'}</span>
                  {player === playerName && <span className="host-badge">You</span>}
                  {player === playerName && isHost && <span className="host-badge">Host</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lobby-actions">
          {isHost ? (
            <button 
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="btn btn-primary"
            >
              Start Game ({players.length}/4 players)
            </button>
          ) : (
            <div className="waiting-message">
              Waiting for host to start the game...
            </div>
          )}
          
          {/* Debug button */}
          <button 
            onClick={() => {
              console.log('Lobby Debug:', { 
                isConnected, 
                roomData, 
                gameData, 
                players: players.length,
                isHost,
                currentRoomCode
              });
            }}
            className="btn btn-secondary"
            style={{ marginTop: '10px' }}
          >
            Debug Lobby
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn btn-outline"
          >
            Leave Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage; 