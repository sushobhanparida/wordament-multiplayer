# Wordament Multiplayer Game

A real-time multiplayer word game built with React frontend and Node.js backend.

## Features

- Real-time multiplayer gameplay
- Solo play mode
- Interactive word board with path highlighting
- Score tracking
- Multiple game themes

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sushobhanparida/wordament-multiplayer)

## Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Start the backend:
   ```bash
   cd backend && npm start
   ```
4. Start the frontend:
   ```bash
   npm start
   ```

## Deployment

This project is configured for deployment on Vercel with:
- Frontend: React app
- Backend: Node.js API routes
- Real-time: Socket.io integration

## Technologies Used

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express, Socket.io
- **Deployment**: Vercel 