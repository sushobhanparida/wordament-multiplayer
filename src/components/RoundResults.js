import React, { useState } from 'react';
import '../styles/RoundResults.css';

const RoundResults = ({ roundResult, players, currentPlayer, onReady, onClose }) => {
  const [isReady, setIsReady] = useState(false);

  const getDifficultyLabel = (difficulty) => {
    if (difficulty <= 10) return 'Easy';
    if (difficulty <= 20) return 'Medium';
    if (difficulty <= 30) return 'Hard';
    return 'Expert';
  };

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 10) return '#4CAF50';
    if (difficulty <= 20) return '#FF9800';
    if (difficulty <= 30) return '#F44336';
    return '#9C27B0';
  };

  const handleReady = () => {
    setIsReady(true);
    onReady();
  };

  // Calculate total words found across all players
  const totalWordsFound = Object.values(roundResult.playerWords || {}).flat().length;
  const allFoundWords = Object.values(roundResult.playerWords || {}).flat();

  return (
    <div className="round-results-overlay">
      <div className="round-results-modal">
        <div className="round-results-header">
          <h2>Round {roundResult.round} Results</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="round-info">
          <h3>Theme: <span className="theme-name">{roundResult.theme}</span></h3>
          <p>Target Word: <span className="target-word">{roundResult.targetWord}</span> (50 points)</p>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Possible Words:</span>
            <span className="stat-value">{roundResult.allPossibleWords.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Words Found:</span>
            <span className="stat-value">{totalWordsFound}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate:</span>
            <span className="stat-value">
              {Math.round((totalWordsFound / roundResult.allPossibleWords.length) * 100)}%
            </span>
          </div>
        </div>

        <div className="words-section">
          <h3>All Possible Words (Ranked by Difficulty)</h3>
          <div className="words-grid">
            {roundResult.allPossibleWords.map((wordData, index) => (
              <div 
                key={wordData.word} 
                className={`word-item ${allFoundWords.includes(wordData.word) ? 'found' : 'not-found'}`}
              >
                <span className="word-text">{wordData.word}</span>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(wordData.difficulty) }}
                >
                  {getDifficultyLabel(wordData.difficulty)}
                </span>
                {allFoundWords.includes(wordData.word) && (
                  <span className="found-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="ready-section">
          <h3>Ready for Next Round</h3>
          <div className="ready-players">
            {players.map(player => (
              <div key={player} className="player-status">
                <span className="player-name">{player}</span>
                <span className={`status ${isReady ? 'ready' : 'waiting'}`}>
                  {isReady ? '✓ Ready' : '⏳ Waiting'}
                </span>
              </div>
            ))}
          </div>
          
          {!isReady && (
            <button onClick={handleReady} className="ready-btn">
              I'm Ready for Next Round
            </button>
          )}
          
          {isReady && (
            <div className="waiting-message">
              Waiting for other players to be ready...
            </div>
          )}
        </div>

        <div className="difficulty-legend">
          <h4>Difficulty Legend:</h4>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
              <span>Easy (1-10)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#FF9800' }}></span>
              <span>Medium (11-20)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#F44336' }}></span>
              <span>Hard (21-30)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#9C27B0' }}></span>
              <span>Expert (31+)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundResults; 