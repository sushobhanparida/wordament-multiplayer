import React, { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/GameBoard.css';
import popSound from '../assets/success-chime.mp3';

const GameBoard = ({ board, setBoard, gameState, onWordSubmit, foundWords = [] }) => {
  const [selectedCells, setSelectedCells] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [foundCellIds, setFoundCellIds] = useState([]);
  const [popCells, setPopCells] = useState([]);
  const [foundHighlightCells, setFoundHighlightCells] = useState([]);
  const boardRef = useRef(null);
  const audioRef = useRef(null);

  const handleCellClick = useCallback((rowIndex, colIndex) => {
    if (gameState !== 'playing') return;

    const cellId = `${rowIndex}-${colIndex}`;

    // If this is a single click (not dragging), allow starting a new word
    if (!isDragging && selectedCells.length === 0) {
      // Start a new word
      setSelectedCells([cellId]);
      setCurrentWord(board[rowIndex][colIndex].letter);
      
      const newBoard = board.map(row => 
        row.map(cell => ({
          ...cell,
          selected: cell.id === cellId,
          inPath: cell.id === cellId
        }))
      );
      setBoard(newBoard);
      return;
    }

    // Check if cell is adjacent to last selected cell (including diagonal)
    if (selectedCells.length > 0) {
      const lastCell = selectedCells[selectedCells.length - 1];
      const [lastRow, lastCol] = lastCell.split('-').map(Number);
      
      const isAdjacent = Math.abs(rowIndex - lastRow) <= 1 && 
                        Math.abs(colIndex - lastCol) <= 1 &&
                        !(rowIndex === lastRow && colIndex === lastCol);
      
      if (!isAdjacent) return;
    }

    // Toggle cell selection
    if (selectedCells.includes(cellId)) {
      // Deselect cell and all cells after it in the path
      const cellIndex = selectedCells.indexOf(cellId);
      const newSelectedCells = selectedCells.slice(0, cellIndex);
      setSelectedCells(newSelectedCells);
      
      // Update current word
      const newWord = newSelectedCells
        .map(id => {
          const [r, c] = id.split('-').map(Number);
          return board[r][c].letter;
        })
        .join('');
      setCurrentWord(newWord);
      
      // Update board - only highlight cells in the current path
      const newBoard = board.map(row => 
        row.map(cell => ({
          ...cell,
          selected: newSelectedCells.includes(cell.id),
          inPath: newSelectedCells.includes(cell.id)
        }))
      );
      setBoard(newBoard);
    } else {
      // Select cell
      const newSelectedCells = [...selectedCells, cellId];
      setSelectedCells(newSelectedCells);
      
      // Update current word
      const newWord = newSelectedCells
        .map(id => {
          const [r, c] = id.split('-').map(Number);
          return board[r][c].letter;
        })
        .join('');
      setCurrentWord(newWord);
      
      // Update board - only highlight cells in the current path
      const newBoard = board.map(row => 
        row.map(cell => ({
          ...cell,
          selected: newSelectedCells.includes(cell.id),
          inPath: newSelectedCells.includes(cell.id)
        }))
      );
      setBoard(newBoard);
    }
  }, [board, gameState, isDragging, selectedCells, setBoard]);

  const clearSelection = useCallback(() => {
    setSelectedCells([]);
    setCurrentWord('');
    const newBoard = board.map(row => 
      row.map(cell => ({
        ...cell,
        inPath: false
      }))
    );
    setBoard(newBoard);
  }, [board, setBoard]);

  const submitWord = useCallback(() => {
    if (currentWord.length >= 3) {
      onWordSubmit(currentWord);
      setFoundCellIds(prev => [...prev, ...selectedCells]);
      setPopCells(selectedCells);
      setFoundHighlightCells(selectedCells);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setTimeout(() => {
        setFoundHighlightCells([]);
        clearSelection();
      }, 1000);
    }
  }, [currentWord, onWordSubmit, clearSelection, selectedCells]);

  // Swipe/Drag functionality
  const handleMouseDown = useCallback((rowIndex, colIndex) => {
    if (gameState !== 'playing') return;
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  }, [gameState, handleCellClick]);

  const handleMouseEnter = useCallback((rowIndex, colIndex) => {
    if (gameState !== 'playing' || !isDragging) return;
    handleCellClick(rowIndex, colIndex);
  }, [gameState, isDragging, handleCellClick]);

  const handleMouseUp = useCallback(() => {
    if (isDragging && currentWord.length >= 3) {
      submitWord();
    }
    setIsDragging(false);
  }, [isDragging, currentWord, submitWord]);

  // Touch events for mobile
  const handleTouchStart = useCallback((rowIndex, colIndex) => {
    if (gameState !== 'playing') return;
    setIsDragging(true);
    handleCellClick(rowIndex, colIndex);
  }, [gameState, handleCellClick]);

  const handleTouchMove = useCallback((e) => {
    if (gameState !== 'playing' || !isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    if (element && element.classList.contains('board-cell')) {
      const rowIndex = parseInt(element.dataset.row);
      const colIndex = parseInt(element.dataset.col);
      handleCellClick(rowIndex, colIndex);
    }
  }, [gameState, isDragging, handleCellClick]);

  const handleTouchEnd = useCallback(() => {
    if (isDragging && currentWord.length >= 3) {
      submitWord();
    }
    setIsDragging(false);
  }, [isDragging, currentWord, submitWord]);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseUp, handleTouchEnd]);

  useEffect(() => {
    if (popCells.length > 0) {
      const timer = setTimeout(() => setPopCells([]), 350);
      return () => clearTimeout(timer);
    }
  }, [popCells]);

  // Check if current word is already found
  const isWordAlreadyFound = foundWords.includes(currentWord.toUpperCase());

  // Generate connection lines between selected cells
  const renderConnectionLines = () => {
    if (selectedCells.length < 2) return null;

    const lines = [];
    
    // Get responsive dimensions based on screen size
    const getResponsiveDimensions = () => {
      const width = window.innerWidth;
      if (width <= 360) {
        return { cellSize: 40, gap: 2, padding: 6 };
      } else if (width <= 480) {
        return { cellSize: 45, gap: 3, padding: 8 };
      } else if (width <= 768) {
        return { cellSize: 55, gap: 5, padding: 12 };
      } else if (width <= 1024) {
        return { cellSize: 65, gap: 7, padding: 18 };
      } else {
        return { cellSize: 70, gap: 8, padding: 20 };
      }
    };

    const { cellSize, gap, padding } = getResponsiveDimensions();

    for (let i = 0; i < selectedCells.length - 1; i++) {
      const currentCell = selectedCells[i];
      const nextCell = selectedCells[i + 1];
      
      const [currentRow, currentCol] = currentCell.split('-').map(Number);
      const [nextRow, nextCol] = nextCell.split('-').map(Number);
      
      const currentX = currentCol * (cellSize + gap) + cellSize / 2 + padding;
      const currentY = currentRow * (cellSize + gap) + cellSize / 2 + padding;
      const nextX = nextCol * (cellSize + gap) + cellSize / 2 + padding;
      const nextY = nextRow * (cellSize + gap) + cellSize / 2 + padding;
      
      // Calculate line properties
      const deltaX = nextX - currentX;
      const deltaY = nextY - currentY;
      const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
      
      const lineStyle = {
        width: `${length}px`,
        left: `${currentX}px`,
        top: `${currentY}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 50%'
      };
      
      lines.push(
        <div
          key={`line-${i}`}
          className="connection-line"
          style={lineStyle}
        />
      );
    }
    
    return lines;
  };

  return (
    <div className="game-board-container">
      {/* Game Board */}
      <div 
        className="game-board"
        ref={boardRef}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {renderConnectionLines()}
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={cell.id}
                className={`board-cell ${foundHighlightCells.includes(cell.id) ? 'found-highlight' : ''} ${cell.inPath ? (foundCellIds.includes(cell.id) ? 'selected' : 'current-swipe') : ''} ${isDragging ? 'dragging' : ''} ${popCells.includes(cell.id) ? 'pop' : ''}`}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                onClick={() => !isDragging && handleCellClick(rowIndex, colIndex)}
              >
                {cell.letter}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Current Word Display - Below the puzzle */}
      <div className="current-word-section">
        <div className="current-word">
          <span className="word-label">Current Word: </span>
          <span className={`word-display ${isWordAlreadyFound ? 'already-found' : ''}`}>
            {currentWord || 'Select letters'}
          </span>
          {isWordAlreadyFound && (
            <span className="already-found-indicator">✓ Already found!</span>
          )}
        </div>
        
        {currentWord && (
          <div className="word-actions">
            <button 
              onClick={submitWord}
              disabled={currentWord.length < 3 || isWordAlreadyFound}
              className={`submit-btn ${currentWord.length >= 3 && !isWordAlreadyFound ? 'active' : ''}`}
            >
              Submit Word
            </button>
            <button onClick={clearSelection} className="clear-btn">
              Clear
            </button>
          </div>
        )}
      </div>
      
      {/* Selected Letters Path */}
      {selectedCells.length > 0 && (
        <div className="word-selection">
          <span className="selection-label">Path: </span>
          <div className="selected-letters">
            {selectedCells.map((cellId, index) => {
              const [row, col] = cellId.split('-').map(Number);
              const letter = board[row][col].letter;
              return (
                <span key={cellId} className="selected-letter">
                  {letter}
                  {index < selectedCells.length - 1 && <span className="arrow">→</span>}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <audio ref={audioRef} src={popSound} preload="auto" />
    </div>
  );
};

export default GameBoard; 