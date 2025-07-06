import React from 'react';
import '../styles/ScoreBoard.css';

const ScoreBoard = ({ players, scores, foundWords, currentPlayer }) => {
  // Ensure players is an array and filter out non-string values
  const validPlayers = Array.isArray(players) ? players.filter(player => typeof player === 'string') : [];
  
  // Sort players by score (highest first)
  const sortedPlayers = [...validPlayers].sort((a, b) => {
    return (scores[b] || 0) - (scores[a] || 0);
  });

  // Calculate total words found across all players
  const totalWordsFound = Object.values(foundWords || {}).flat().length;

  // Calculate average word length
  const allWords = Object.values(foundWords || {}).flat();
  const averageWordLength = allWords.length > 0 
    ? (allWords.reduce((sum, word) => sum + word.length, 0) / allWords.length).toFixed(1)
    : '0';

  // Debug logging
  console.log('ScoreBoard render:', { players, scores, foundWords, currentPlayer });

  return (
    <div className="score-board">
      <h2>Scoreboard</h2>
      
      <div className="players-scores">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player} 
            className={`player-score ${player === currentPlayer ? 'current-player' : ''}`}
          >
            <div className="player-rank">#{index + 1}</div>
            <div className="player-info">
              <div className="player-name">
                {player}
                {player === currentPlayer && <span className="you-badge">(You)</span>}
              </div>
              <div className="player-score-value">
                {scores[player] || 0} points
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="game-stats">
        <div className="stat-item">
          <span className="stat-label">Total Words Found:</span>
          <span className="stat-value">{totalWordsFound}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Average Word Length:</span>
          <span className="stat-value">{averageWordLength}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard; 