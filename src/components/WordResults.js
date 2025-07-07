import React from 'react';
import '../styles/WordResults.css';

const WordResults = ({ allWords, foundWords, theme, targetWord, onClose }) => {
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

  return (
    <div className="word-results-overlay">
      <div className="word-results-modal">
        <div className="word-results-header">
          <h2>Round Results</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <div className="theme-info">
          <h3>Theme: <span className="theme-name">{theme}</span></h3>
        </div>

        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-label">Total Possible Words:</span>
            <span className="stat-value">{allWords.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Words Found:</span>
            <span className="stat-value">{foundWords.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate:</span>
            <span className="stat-value">
              {Math.round((foundWords.length / allWords.length) * 100)}%
            </span>
          </div>
        </div>

        <div className="words-section">
          <h3>All Possible Words (Ranked by Difficulty)</h3>
          <div className="words-grid">
            {allWords.map((wordData, index) => (
              <div 
                key={wordData.word} 
                className={`word-item ${foundWords.includes(wordData.word) ? 'found' : 'not-found'}`}
              >
                <span className="word-text">{wordData.word}</span>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(wordData.difficulty) }}
                >
                  {getDifficultyLabel(wordData.difficulty)}
                </span>
                {foundWords.includes(wordData.word) && (
                  <span className="found-indicator">✓</span>
                )}
              </div>
            ))}
          </div>
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

export default WordResults; 