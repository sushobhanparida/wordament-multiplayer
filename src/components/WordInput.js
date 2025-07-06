import React, { useState } from 'react';
import '../styles/WordInput.css';

const WordInput = ({ onSubmit, foundWords, disabled }) => {
  const [inputWord, setInputWord] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputWord.trim() && !disabled) {
      onSubmit(inputWord.trim().toUpperCase());
      setInputWord('');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="word-input-container">
      {showFeedback && (
        <div style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: 10 }}>
          Great! You found a word!
        </div>
      )}
      <form onSubmit={handleSubmit} className="word-form">
        <input
          type="text"
          value={inputWord}
          onChange={(e) => setInputWord(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your word here..."
          className="word-input"
          disabled={disabled}
          maxLength={16}
        />
        <button 
          type="submit" 
          className="submit-btn"
          disabled={!inputWord.trim() || disabled}
        >
          Submit
        </button>
      </form>

      <div className="found-words">
        <h3>Found Words ({foundWords.length})</h3>
        <div className="words-list">
          {foundWords.length > 0 ? (
            foundWords.map((word, index) => (
              <div key={index} className="found-word">
                {word} ({word.length} pts)
              </div>
            ))
          ) : (
            <div className="no-words">No words found yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WordInput; 