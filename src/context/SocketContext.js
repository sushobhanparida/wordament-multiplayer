import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Connect to the backend server
    const serverUrl = process.env.NODE_ENV === 'production'
      ? 'https://wordament-multiplayer-backend.onrender.com'
      : 'http://localhost:5000';
    
    const newSocket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
      setIsConnecting(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnecting(false);
      setConnectionError('Failed to connect to server. Please check if the backend is running.');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to server after', attemptNumber, 'attempts');
      setIsConnected(true);
      setIsConnecting(false);
      setConnectionError(null);
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
      setConnectionError('Connection lost. Trying to reconnect...');
    });

    newSocket.on('roomCreated', (data) => {
      console.log('SocketContext: Room created event received:', data);
      console.log('SocketContext: isSolo flag:', data.isSolo);
      console.log('SocketContext: roomCode:', data.roomCode);
      console.log('SocketContext: players:', data.players);
      console.log('SocketContext: players data type:', typeof data.players, 'value:', data.players);
      
      const roomDataToSet = {
        roomCode: data.roomCode,
        players: data.players,
        isSolo: data.isSolo
      };
      console.log('SocketContext: Setting roomData to:', roomDataToSet);
      setRoomData(roomDataToSet);
    });

    newSocket.on('playerJoined', (data) => {
      console.log('Player joined:', data);
      console.log('Player joined - players data type:', typeof data.players, 'value:', data.players);
      setRoomData(prev => ({
        ...prev,
        players: data.players
      }));
    });

    newSocket.on('playerLeft', (data) => {
      console.log('Player left:', data);
      setRoomData(prev => ({
        ...prev,
        players: data.players
      }));
    });

    newSocket.on('gameStarted', (data) => {
      console.log('Game started event received:', data);
      const newGameData = {
        ...data.gameState,
        gameState: 'playing',
        currentRound: data.gameState.currentRound,
        foundWords: data.gameState.foundWords || {},
        scores: data.gameState.scores || {},
        players: data.players || []
      };
      console.log('Setting gameData to:', newGameData);
      setGameData(newGameData);
    });

    newSocket.on('wordSubmitted', (data) => {
      console.log('Word submitted:', data);
      // Update game data with new word and scores
      setGameData(prev => ({
        ...prev,
        scores: data.scores || prev.scores
      }));
    });

    newSocket.on('roundEnded', (data) => {
      console.log('Round ended:', data);
      setGameData(prev => ({
        ...prev,
        roundResult: data,
        gameState: 'roundEnd'
      }));
    });

    newSocket.on('playerReady', (data) => {
      console.log('Player ready:', data);
      setGameData(prev => ({
        ...prev,
        allReady: data.allReady
      }));
    });

    newSocket.on('newRoundStarted', (data) => {
      console.log('New round started:', data);
      const newGameData = {
        ...data.gameState,
        gameState: 'playing',
        foundWords: {},
        roundResult: null
      };
      console.log('Setting gameData for new round:', newGameData);
      setGameData(newGameData);
    });

    newSocket.on('gameEnded', (data) => {
      console.log('Game ended:', data);
      setGameData(prev => ({
        ...prev,
        finalScores: data.finalScores,
        roundResults: data.roundResults,
        gameState: 'finished'
      }));
      console.log('Setting gameData for game end:', data);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message || 'An error occurred');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = (playerName, totalRounds = 3, isSolo = false) => {
    if (socket) {
      socket.emit('createRoom', { playerName, totalRounds, isSolo }, (response) => {
        if (response.success) {
          console.log('Room created successfully:', response);
        } else {
          console.error('Failed to create room:', response.error);
          setError(response.error);
        }
      });
    }
  };

  const joinRoom = (roomCode, playerName) => {
    if (socket) {
      socket.emit('joinRoom', { roomCode, playerName }, (response) => {
        if (response.success) {
          console.log('Joined room successfully:', response);
        } else {
          console.error('Failed to join room:', response.error);
          setError(response.error);
        }
      });
    }
  };

  const startGame = (roomCode) => {
    console.log('startGame called, socket:', !!socket);
    if (socket) {
      console.log('Emitting startGame event');
      socket.emit('startGame', { roomCode }, (response) => {
        if (response.success) {
          console.log('Game started successfully');
        } else {
          console.error('Failed to start game:', response.error);
          setError(response.error);
        }
      });
    } else {
      console.log('No socket available');
    }
  };

  const submitWord = (roomCode, word) => {
    if (socket) {
      socket.emit('submitWord', { roomCode, word }, (response) => {
        if (!response.success) {
          console.error('Failed to submit word:', response.error);
          setError(response.error);
        }
      });
    }
  };

  const endGame = () => {
    if (socket) {
      socket.emit('gameEnded');
    }
  };

  const setReadyForNextRound = (roomCode) => {
    if (socket) {
      socket.emit('playerReady', { roomCode }, (response) => {
        if (!response.success) {
          console.error('Failed to mark ready:', response.error);
          setError(response.error);
        }
      });
    }
  };

  const value = {
    socket,
    isConnected,
    isConnecting,
    connectionError,
    roomData,
    gameData,
    error,
    createRoom,
    joinRoom,
    startGame,
    submitWord,
    endGame,
    setReadyForNextRound
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 