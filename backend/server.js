const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const GameManager = require('./gameManager');
const { generateGameBoard, getRandomTheme } = require('./gameUtils');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ["https://your-actual-domain.vercel.app", "https://your-actual-domain.vercel.app/"] 
      : "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Game manager instance
const gameManager = new GameManager();

// Helper function to generate room codes
const generateRoomCode = () => {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
};

// REST API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Wordament Backend is running' });
});

app.get('/api/rooms', (req, res) => {
  const rooms = gameManager.getRooms();
  res.json({ rooms });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle room joining
  socket.on('joinRoom', (data, callback) => {
    try {
      const { roomCode, playerName } = data;
      console.log(`Attempting to join room: ${roomCode} with player: ${playerName}`);
      
      if (!roomCode || !playerName || playerName.trim().length === 0) {
        callback({ success: false, error: 'Room code and player name are required' });
        return;
      }

      const result = gameManager.joinRoom(roomCode.toUpperCase(), playerName.trim());
      
      if (result.success) {
        socket.join(roomCode.toUpperCase());
        socket.roomCode = roomCode.toUpperCase();
        socket.playerName = playerName.trim();
        
        console.log(`${playerName} successfully joined room ${roomCode}`);
        
        // Emit player joined event to all players in the room
        io.to(roomCode.toUpperCase()).emit('playerJoined', {
          playerName: playerName.trim(),
          players: gameManager.getRoomPlayers(roomCode.toUpperCase())
        });
        
        // If joining as spectator, send current game state
        if (result.gameState) {
          socket.emit('gameState', result.gameState);
        }
        
        callback({ success: true, message: result.message });
      } else {
        callback({ success: false, error: result.message });
      }
    } catch (error) {
      console.error('Error joining room:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle room creation
  socket.on('createRoom', (data, callback) => {
    try {
      const { playerName, totalRounds = 3, isSolo = false } = data;
      console.log(`Room creation requested by ${playerName}${isSolo ? ' (solo)' : ''} with ${totalRounds} rounds`);
      
      if (!playerName || playerName.trim().length === 0) {
        callback({ success: false, error: 'Player name is required' });
        return;
      }

      const roomCode = generateRoomCode();
      const success = gameManager.createRoom(roomCode, playerName, isSolo, totalRounds);
      
      if (success) {
        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.playerName = playerName;
        
        console.log(`Room ${roomCode} created by ${playerName}${isSolo ? ' (solo mode)' : ''}`);
        
        // Emit room created event to all players in the room
        const players = gameManager.getRoomPlayers(roomCode);
        const roomCreatedData = {
          roomCode,
          players: players,
          isSolo
        };
        console.log(`Server: Emitting roomCreated with data:`, roomCreatedData);
        console.log(`Server: isSolo flag being sent:`, isSolo);
        io.to(roomCode).emit('roomCreated', roomCreatedData);
        
        callback({ success: true, roomCode });
      } else {
        callback({ success: false, error: 'Failed to create room' });
      }
    } catch (error) {
      console.error('Error creating room:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle game start
  socket.on('startGame', (data, callback) => {
    try {
      const { roomCode } = data;
      console.log(`Game start requested for room ${roomCode}`);
      
      if (!roomCode || !gameManager.rooms.has(roomCode)) {
        callback({ success: false, error: 'Room not found' });
        return;
      }

      const room = gameManager.rooms.get(roomCode);
      const players = gameManager.getRoomPlayers(roomCode);
      
      // Allow solo games to start immediately, multiplayer games need at least 2 players
      if (room.isSolo || players.length >= 2) {
        const success = gameManager.startGame(roomCode);
        
        if (success) {
          console.log(`Game started in room ${roomCode}`);
          
          // Emit game started event to all players in the room
          console.log(`Server: Emitting gameStarted with players:`, players, 'type:', typeof players);
          io.to(roomCode).emit('gameStarted', {
            roomCode,
            players,
            gameState: gameManager.getGameState(roomCode)
          });
          
          callback({ success: true });
        } else {
          callback({ success: false, error: 'Failed to start game' });
        }
      } else {
        callback({ success: false, error: 'Need at least 2 players to start a multiplayer game' });
      }
    } catch (error) {
      console.error('Error starting game:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle word submission
  socket.on('submitWord', (data, callback) => {
    try {
      const { roomCode, word } = data;
      
      if (!roomCode || !word || !socket.playerName) {
        callback({ success: false, error: 'Invalid request' });
        return;
      }

      const result = gameManager.submitWord(roomCode, socket.playerName, word);
      
      if (result.success) {
        // Emit word submitted event to all players in the room
        io.to(roomCode).emit('wordSubmitted', {
          playerName: socket.playerName,
          word: result.word,
          score: result.score,
          totalScore: result.totalScore,
          isTargetWord: result.isTargetWord,
          scores: gameManager.getGameState(roomCode)?.scores || {}
        });
        
        callback({ success: true, ...result });
      } else {
        callback({ success: false, error: result.message });
      }
    } catch (error) {
      console.error('Error submitting word:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle player ready for next round
  socket.on('playerReady', (data, callback) => {
    try {
      const { roomCode } = data;
      
      if (!roomCode || !socket.playerName) {
        callback({ success: false, error: 'Invalid request' });
        return;
      }

      const result = gameManager.playerReady(roomCode, socket.playerName);
      
      if (result) {
        // Emit player ready event to all players in the room
        io.to(roomCode).emit('playerReady', {
          playerName: socket.playerName,
          allReady: result.allReady || false
        });
        
        // If all players are ready, handle next round or game end
        if (result.allReady) {
          if (result.gameEnd) {
            // Game is over
            console.log(`Game ended in room ${roomCode}, emitting gameEnded event`);
            io.to(roomCode).emit('gameEnded', {
              finalScores: gameManager.getGameState(roomCode)?.scores || {},
              roundResults: gameManager.getRoom(roomCode)?.roundResults || []
            });
          } else if (result.newRound) {
            // Start new round
            const gameState = gameManager.getGameState(roomCode);
            console.log(`Starting new round ${gameState.currentRound} in room ${roomCode}`);
            io.to(roomCode).emit('newRoundStarted', {
              gameState,
              roundNumber: gameState.currentRound
            });
          }
        }
        
        callback({ success: true, allReady: result.allReady || false });
      } else {
        callback({ success: false, error: 'Failed to mark player ready' });
      }
    } catch (error) {
      console.error('Error marking player ready:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle round end (timer expired)
  socket.on('roundEnd', (data, callback) => {
    try {
      const { roomCode } = data;
      
      if (!roomCode) {
        callback({ success: false, error: 'Room code required' });
        return;
      }

      const roundResult = gameManager.endRound(roomCode);
      
      if (roundResult) {
        // Emit round ended event to all players in the room
        io.to(roomCode).emit('roundEnded', roundResult);
        callback({ success: true, roundResult });
      } else {
        callback({ success: false, error: 'Failed to end round' });
      }
    } catch (error) {
      console.error('Error ending round:', error);
      callback({ success: false, error: 'Internal server error' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomCode && socket.playerName) {
      const success = gameManager.removePlayer(socket.roomCode, socket.playerName);
      
      if (success) {
        // Notify remaining players
        io.to(socket.roomCode).emit('playerLeft', {
          playerName: socket.playerName,
          players: gameManager.getRoomPlayers(socket.roomCode)
        });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

// For Vercel deployment, export the server
if (process.env.NODE_ENV === 'production') {
  // Vercel serverless function
  module.exports = server;
} else {
  // Local development
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend should connect to: http://localhost:${PORT}`);
  });
} 