import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import GameBoard from '../components/GameBoard';
import ScoreBoard from '../components/ScoreBoard';
import Timer from '../components/Timer';
import WordResults from '../components/WordResults';
import RoundResults from '../components/RoundResults';
import '../styles/GamePage.css';

const GamePage = () => {
  const navigate = useNavigate();
  const { roomCode } = useParams();
  const location = useLocation();
  const { 
    gameData, 
    roomData, 
    submitWord, 
    setReadyForNextRound,
    isConnected 
  } = useSocket();
  
  const [showWordResults, setShowWordResults] = useState(false);
  const [showRoundResults, setShowRoundResults] = useState(false);
  const [currentRoomCode] = useState(roomCode || location.state?.roomCode);

  useEffect(() => {
    if (!isConnected) {
      console.log('Not connected, navigating to home');
      navigate('/');
      return;
    }

    if (!currentRoomCode) {
      console.log('No room code, navigating to home');
      navigate('/');
      return;
    }

    console.log('GamePage mounted with:', { roomCode: currentRoomCode, roomData, gameData });
  }, [isConnected, currentRoomCode, navigate, roomData, gameData]);

  // Debug: Log game state changes
  useEffect(() => {
    if (gameData) {
      console.log('GamePage: Game data updated:', {
        gameState: gameData.gameState,
        currentRound: gameData.currentRound,
        totalRounds: gameData.totalRounds,
        gameBoard: gameData.gameBoard?.length,
        players: gameData.players?.length,
        isSolo: gameData.isSolo
      });
    }
  }, [gameData]);

  useEffect(() => {
    if (gameData?.gameState === 'finished') {
      setShowWordResults(true);
    }
  }, [gameData]);

  useEffect(() => {
    if (gameData?.gameState === 'roundEnd' && gameData?.roundResult) {
      setShowRoundResults(true);
    }
  }, [gameData?.gameState, gameData?.roundResult]);

  const handleWordSubmit = (word) => {
    if (currentRoomCode) {
      submitWord(currentRoomCode, word);
    }
  };

  const handleReadyForNextRound = () => {
    if (currentRoomCode) {
      setReadyForNextRound(currentRoomCode);
    }
  };

  const handleCloseRoundResults = () => {
    setShowRoundResults(false);
  };

  const handleCloseWordResults = () => {
    setShowWordResults(false);
    navigate('/');
  };

  // Debug logging
  console.log('GamePage render:', { gameData, roomData, isConnected, currentRoomCode });

  if (!currentRoomCode) {
    return (
      <div className="game-page">
        <div className="loading">Loading room data...</div>
      </div>
    );
  }

  if (!gameData) {
    return (
      <div className="game-page">
        <div className="loading">Waiting for game to start...</div>
      </div>
    );
  }

  const { 
    gameBoard = [], 
    theme = '', 
    targetWord = '', 
    foundWords = {}, 
    scores = {}, 
    startTime, 
    endTime,
    currentRound = 1,
    gameState = 'waiting',
    players = []
  } = gameData || {};

  // Convert foundWords object to array for compatibility
  const foundWordsArray = Object.values(foundWords).flat();

  return (
    <div className="game-page">
      <div className="game-header">
        <h1>Wordament</h1>
        <div className="room-info">Room: {currentRoomCode}</div>
        <div className="round-info">Round {currentRound} of 3</div>
        <div className="theme-info">
          <span className="theme-label">Theme: </span>
          <span className="theme-value">{theme}</span>
          <span className="target-label">Target: </span>
          <span className="target-value">{targetWord}</span>
        </div>
        {gameState === 'playing' && (
          <Timer 
            startTime={startTime} 
            endTime={endTime} 
            onTimeUp={() => {}} 
          />
        )}
        

      </div>

      <div className="game-content">
        <div className="game-left">
          {gameBoard && gameBoard.length > 0 ? (
            <GameBoard 
              board={gameBoard} 
              setBoard={() => {}}
              gameState={gameState}
              onWordSubmit={handleWordSubmit}
              foundWords={foundWordsArray}
            />
          ) : (
            <div className="loading-board">
              <div className="loading">Loading game board...</div>
            </div>
          )}
        </div>

        <div className="game-right">
          <ScoreBoard 
            players={players}
            scores={scores}
            foundWords={foundWords}
            currentPlayer={location.state?.playerName}
          />
        </div>
      </div>

      {showRoundResults && gameData.roundResult && (
        <RoundResults
          roundResult={gameData.roundResult}
          players={players}
          currentPlayer={location.state?.playerName}
          onReady={handleReadyForNextRound}
          onClose={handleCloseRoundResults}
        />
      )}

      {showWordResults && gameData.finalScores && (
        <WordResults
          allWords={gameData.allPossibleWords || []}
          foundWords={foundWordsArray}
          theme={theme}
          targetWord={targetWord}
          onClose={handleCloseWordResults}
        />
      )}
    </div>
  );
};

export default GamePage; 