const { v4: uuidv4 } = require('uuid');
const { calculateWordScore, generateAllPossibleWords, rankWordsByDifficulty } = require('./gameUtils');
const fs = require('fs');
const path = require('path');

class GameManager {
  constructor() {
    this.rooms = new Map();
    this.players = new Map(); // socketId -> player info

    const dictionaryPath = path.join(__dirname, 'englishDictionary.txt');
    this.englishWords = new Set(
      fs.readFileSync(dictionaryPath, 'utf-8')
        .split('\n')
        .map(word => word.trim().toUpperCase())
        .filter(Boolean)
    );
  }

  createRoom(roomCode, playerName, isSolo = false, totalRounds = 3) {
    try {
      if (this.rooms.has(roomCode)) {
        console.log(`Room ${roomCode} already exists`);
        return false;
      }

      const room = {
        id: roomCode,
        players: [playerName],
        gameState: 'waiting', // waiting, playing, roundEnd, gameEnd
        currentRound: 0,
        totalRounds: totalRounds,
        gameBoard: null,
        theme: null,
        targetWord: null,
        startTime: null,
        endTime: null,
        scores: { [playerName]: 0 },
        foundWords: { [playerName]: [] },
        readyPlayers: new Set(),
        isSolo: isSolo,
        roundResults: []
      };

      this.rooms.set(roomCode, room);
      console.log(`GameManager: Room ${roomCode} created by ${playerName}${isSolo ? ' (solo mode)' : ''}`);
      return true;
    } catch (error) {
      console.error('GameManager: Error creating room:', error);
      return false;
    }
  }

  joinRoom(roomCode, playerName) {
    try {
      console.log(`GameManager: Joining room ${roomCode} with player ${playerName}`);
      
      if (!this.rooms.has(roomCode)) {
        console.log(`GameManager: Room ${roomCode} not found`);
        return { success: false, message: 'Room not found' };
      }

      const room = this.rooms.get(roomCode);
      console.log(`GameManager: Room found, current players:`, room.players);
      console.log(`GameManager: Room game state:`, room.gameState);

      // Check if player already exists
      if (room.players.includes(playerName)) {
        console.log(`GameManager: Player ${playerName} already in room`);
        return { success: false, message: 'Player name already taken' };
      }

      // For solo rooms, don't allow additional players
      if (room.isSolo) {
        console.log(`GameManager: Cannot join solo room ${roomCode}`);
        return { success: false, message: 'This is a solo game room' };
      }

      // Add player to room
      room.players.push(playerName);
      room.scores[playerName] = 0;
      room.foundWords[playerName] = [];
      
      console.log(`GameManager: Successfully added player ${playerName} to room ${roomCode}`);
      console.log(`GameManager: Room now has ${room.players.length} players`);

      // If game is already in progress, send current game state to new player
      if (room.gameState === 'playing') {
        console.log(`GameManager: Sending current game state to new player ${playerName}`);
        return { 
          success: true, 
          message: 'Joined as spectator',
          gameState: this.getGameState(roomCode)
        };
      }

      return { success: true, message: 'Successfully joined room' };
    } catch (error) {
      console.error('GameManager: Error joining room:', error);
      return { success: false, message: 'Failed to join room' };
    }
  }

  startGame(roomCode) {
    try {
      if (!this.rooms.has(roomCode)) {
        console.log(`GameManager: Cannot start game - room ${roomCode} not found`);
        return false;
      }

      const room = this.rooms.get(roomCode);
      
      // For solo games, start immediately. For multiplayer, need at least 2 players
      if (!room.isSolo && room.players.length < 2) {
        console.log(`GameManager: Cannot start game - need at least 2 players`);
        return false;
      }

      // Generate game board and theme
      const gameBoard = require('./gameUtils').generateGameBoard();
      const { theme, targetWord } = require('./gameUtils').getRandomTheme();
      
      room.gameState = 'playing';
      room.gameBoard = gameBoard;
      room.theme = theme;
      room.targetWord = targetWord;
      room.startTime = Date.now();
      room.endTime = room.startTime + (1 * 60 * 1000); // 1 minute
      room.currentRound = 1; // Start at round 1, not 0
      room.readyPlayers.clear();
      
      // Reset scores and found words for new game
      room.players.forEach(player => {
        room.scores[player] = 0;
        room.foundWords[player] = [];
      });

      console.log(`GameManager: Game started in room ${roomCode} with theme: ${theme}, target: ${targetWord}, isSolo: ${room.isSolo}`);
      return true;
    } catch (error) {
      console.error('GameManager: Error starting game:', error);
      return false;
    }
  }

  submitWord(roomCode, playerName, word) {
    try {
      if (!this.rooms.has(roomCode)) {
        console.log(`GameManager: Cannot submit word - room ${roomCode} not found`);
        return { success: false, message: 'Room not found' };
      }

      const room = this.rooms.get(roomCode);
      
      if (room.gameState !== 'playing') {
        console.log(`GameManager: Cannot submit word - game not in playing state`);
        return { success: false, message: 'Game not in progress' };
      }

      if (!room.players.includes(playerName)) {
        console.log(`GameManager: Player ${playerName} not in room ${roomCode}`);
        return { success: false, message: 'Player not in room' };
      }

      const upperWord = word.toUpperCase();
      
      // Check if word was already found by this player
      if (room.foundWords[playerName].includes(upperWord)) {
        console.log(`GameManager: Word ${upperWord} already found by ${playerName}`);
        return { success: false, message: 'Word already found' };
      }

      // Validate word on the board
      const isValid = this.isValidWord(room.gameBoard, upperWord);
      if (!isValid) {
        console.log(`GameManager: Word ${upperWord} is not valid on the board`);
        return { success: false, message: 'Word not found on board' };
      }

      // Calculate score
      const score = calculateWordScore(upperWord, room.theme, room.targetWord);
      
      // Add word and score
      room.foundWords[playerName].push(upperWord);
      room.scores[playerName] += score;
      
      console.log(`GameManager: ${playerName} submitted word: ${upperWord} (${score} points)`);
      
      return { 
        success: true, 
        word: upperWord, 
        score: score, 
        totalScore: room.scores[playerName],
        isTargetWord: upperWord === room.targetWord
      };
    } catch (error) {
      console.error('GameManager: Error submitting word:', error);
      return { success: false, message: 'Failed to submit word' };
    }
  }

  endRound(roomCode) {
    try {
      if (!this.rooms.has(roomCode)) {
        console.log(`GameManager: Cannot end round - room ${roomCode} not found`);
        return false;
      }

      const room = this.rooms.get(roomCode);
      
      if (room.gameState !== 'playing') {
        console.log(`GameManager: Cannot end round - game not in playing state`);
        return false;
      }

      // Generate all possible words for this round
      const allPossibleWords = generateAllPossibleWords(room.gameBoard);
      const filteredWords = allPossibleWords.filter(word => this.englishWords.has(word.toUpperCase()));
      const rankedWords = rankWordsByDifficulty(filteredWords);
      
      // Create round result
      const roundResult = {
        round: room.currentRound,
        theme: room.theme,
        targetWord: room.targetWord,
        allPossibleWords: rankedWords,
        playerScores: { ...room.scores },
        playerWords: { ...room.foundWords }
      };
      
      room.roundResults.push(roundResult);
      room.gameState = 'roundEnd';
      room.readyPlayers.clear();
      
      console.log(`GameManager: Round ${room.currentRound} ended in room ${roomCode}`);
      console.log(`GameManager: Round result:`, roundResult);
      
      return roundResult;
    } catch (error) {
      console.error('GameManager: Error ending round:', error);
      return false;
    }
  }

  playerReady(roomCode, playerName) {
    try {
      if (!this.rooms.has(roomCode)) {
        console.log(`GameManager: Cannot mark ready - room ${roomCode} not found`);
        return false;
      }

      const room = this.rooms.get(roomCode);
      
      if (!room.players.includes(playerName)) {
        console.log(`GameManager: Player ${playerName} not in room ${roomCode}`);
        return false;
      }

      room.readyPlayers.add(playerName);
      console.log(`GameManager: ${playerName} is ready for next round in room ${roomCode}`);
      
      // Check if all players are ready
      const allReady = room.players.every(player => room.readyPlayers.has(player));
      
      if (allReady) {
        room.currentRound++;
        
        // Check if game is over
        if (room.currentRound > room.totalRounds) {
          room.gameState = 'gameEnd';
          console.log(`GameManager: Game ended in room ${roomCode} (completed ${room.totalRounds} rounds)`);
          return { allReady: true, gameEnd: true };
        } else {
          // Start next round
          const gameBoard = require('./gameUtils').generateGameBoard();
          const { theme, targetWord } = require('./gameUtils').getRandomTheme();
          
          room.gameState = 'playing';
          room.gameBoard = gameBoard;
          room.theme = theme;
          room.targetWord = targetWord;
          room.startTime = Date.now();
          room.endTime = room.startTime + (1 * 60 * 1000); // 1 minute
          room.readyPlayers.clear();
          
          // Reset found words for new round (keep scores)
          room.players.forEach(player => {
            room.foundWords[player] = [];
          });
          
          console.log(`GameManager: Starting round ${room.currentRound} in room ${roomCode} (solo: ${room.isSolo})`);
          return { allReady: true, gameEnd: false, newRound: true };
        }
      }
      
      return { allReady: false };
    } catch (error) {
      console.error('GameManager: Error marking player ready:', error);
      return false;
    }
  }

  getRoomPlayers(roomCode) {
    if (!this.rooms.has(roomCode)) {
      return [];
    }
    return this.rooms.get(roomCode).players;
  }

  getGameState(roomCode) {
    if (!this.rooms.has(roomCode)) {
      return null;
    }
    
    const room = this.rooms.get(roomCode);
    return {
      gameState: room.gameState,
      gameBoard: room.gameBoard,
      theme: room.theme,
      targetWord: room.targetWord,
      startTime: room.startTime,
      endTime: room.endTime,
      currentRound: room.currentRound,
      totalRounds: room.totalRounds,
      scores: room.scores,
      foundWords: room.foundWords,
      players: room.players,
      isSolo: room.isSolo
    };
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  removePlayer(roomCode, playerName) {
    try {
      if (!this.rooms.has(roomCode)) {
        return false;
      }

      const room = this.rooms.get(roomCode);
      const playerIndex = room.players.indexOf(playerName);
      
      if (playerIndex === -1) {
        return false;
      }

      room.players.splice(playerIndex, 1);
      delete room.scores[playerName];
      delete room.foundWords[playerName];
      room.readyPlayers.delete(playerName);
      
      console.log(`GameManager: ${playerName} left room ${roomCode}`);
      
      // If no players left, remove the room
      if (room.players.length === 0) {
        this.rooms.delete(roomCode);
        console.log(`GameManager: Room ${roomCode} removed (no players left)`);
      }
      
      return true;
    } catch (error) {
      console.error('GameManager: Error removing player:', error);
      return false;
    }
  }

  isValidWord(board, word) {
    if (word.length < 3) return false;
    
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];
    
    const isValidPosition = (row, col) => row >= 0 && row < 4 && col >= 0 && col < 4;
    
    const checkWord = (startRow, startCol, direction) => {
      for (let i = 0; i < word.length; i++) {
        const row = startRow + (direction[0] * i);
        const col = startCol + (direction[1] * i);
        
        if (!isValidPosition(row, col) || board[row][col].letter !== word[i]) {
          return false;
        }
      }
      return true;
    };
    
    // Check all possible starting positions and directions
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        for (const direction of directions) {
          if (checkWord(row, col, direction)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
}

module.exports = GameManager; 