import React, { createContext, useContext, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
  players: [],
  currentPlayer: null,
  gameBoard: [],
  gameState: 'waiting', // waiting, playing, finished
  scores: {},
  foundWords: [],
  timeRemaining: 120, // 2 minutes
  roomId: null
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'SET_GAME_BOARD':
      return { ...state, gameBoard: action.payload };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'ADD_WORD':
      return { 
        ...state, 
        foundWords: [...state.foundWords, action.payload] 
      };
    case 'UPDATE_SCORE':
      return { 
        ...state, 
        scores: { ...state.scores, [action.payload.playerId]: action.payload.score } 
      };
    case 'SET_TIME':
      return { ...state, timeRemaining: action.payload };
    case 'SET_ROOM':
      return { ...state, roomId: action.payload };
    default:
      return state;
  }
};

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 