# Wordament Backend

Real-time multiplayer backend for the Wordament game using Node.js, Express, and Socket.IO.

## Features

- **Real-time Multiplayer**: WebSocket connections for live game updates
- **Room Management**: Create and join game rooms
- **Game Logic**: Word validation, scoring, and theme-based gameplay
- **Player Management**: Handle player connections and disconnections

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```
PORT=5000
NODE_ENV=development
```

## Running the Server

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 5000 (or the port specified in your .env file).

## API Endpoints

### Health Check
- `GET /api/health` - Check if the server is running

## Socket.IO Events

### Client to Server
- `createRoom` - Create a new game room
- `joinRoom` - Join an existing room
- `startGame` - Start the game in a room
- `submitWord` - Submit a word during gameplay
- `gameEnded` - Notify server that game has ended

### Server to Client
- `roomCreated` - Room successfully created
- `playerJoined` - New player joined the room
- `playerLeft` - Player left the room
- `gameStarted` - Game has started
- `wordSubmitted` - Word was successfully submitted
- `gameEnded` - Game has ended with final results
- `error` - Error occurred
- `wordError` - Word submission error

## Game Flow

1. **Room Creation**: Player creates or joins a room
2. **Game Start**: Host starts the game, generates board and theme
3. **Gameplay**: Players submit words in real-time
4. **Game End**: Timer expires, show all possible words and scores

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production) 