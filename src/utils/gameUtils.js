// Common English words for different themes
const THEME_WORDS = {
  nature: ['TREE', 'FLOWER', 'GRASS', 'LEAF', 'BIRD', 'FISH', 'SUN', 'MOON', 'STAR', 'WATER', 'EARTH', 'WIND', 'FIRE', 'ROCK', 'SAND'],
  animals: ['CAT', 'DOG', 'LION', 'TIGER', 'BEAR', 'WOLF', 'FOX', 'DEER', 'HORSE', 'COW', 'PIG', 'SHEEP', 'GOAT', 'DUCK', 'GOOSE'],
  food: ['BREAD', 'MILK', 'EGG', 'MEAT', 'FISH', 'RICE', 'BEAN', 'CORN', 'POTATO', 'CARROT', 'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'CHERRY'],
  colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN', 'BLACK', 'WHITE', 'GRAY', 'GOLD', 'SILVER', 'NAVY', 'TEAL'],
  emotions: ['HAPPY', 'SAD', 'ANGRY', 'SCARED', 'EXCITED', 'CALM', 'NERVOUS', 'PROUD', 'SHY', 'BRAVE', 'KIND', 'MEAN', 'FUNNY', 'SERIOUS', 'LOVE']
};

// Difficulty scoring based on word characteristics
const calculateWordDifficulty = (word) => {
  let difficulty = 0;
  
  // Length factor (longer words are harder)
  difficulty += word.length * 2;
  
  // Letter frequency factor (rare letters make words harder)
  const rareLetters = ['Q', 'Z', 'X', 'J', 'V', 'K', 'W', 'Y', 'F', 'B'];
  const rareLetterCount = word.split('').filter(letter => rareLetters.includes(letter)).length;
  difficulty += rareLetterCount * 5;
  
  // Vowel-consonant pattern factor
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const vowelCount = word.split('').filter(letter => vowels.includes(letter)).length;
  const consonantCount = word.length - vowelCount;
  
  // Words with unusual vowel-consonant patterns are harder
  if (vowelCount === 0 || consonantCount === 0) {
    difficulty += 10;
  } else if (Math.abs(vowelCount - consonantCount) > 2) {
    difficulty += 5;
  }
  
  // Common word bonus (easier to guess)
  const allThemeWords = Object.values(THEME_WORDS).flat();
  if (allThemeWords.includes(word)) {
    difficulty -= 15;
  }
  
  return Math.max(1, difficulty);
};

// Generate all possible words from a 4x4 board
const generateAllPossibleWords = (board) => {
  const words = new Set();
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  const isValidPosition = (row, col) => row >= 0 && row < 4 && col >= 0 && col < 4;
  
  const dfs = (row, col, currentWord, visited) => {
    if (currentWord.length >= 3) {
      words.add(currentWord);
    }
    
    if (currentWord.length >= 8) return; // Limit word length
    
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      
      if (isValidPosition(newRow, newCol) && !visited.has(`${newRow}-${newCol}`)) {
        const newWord = currentWord + board[newRow][newCol].letter;
        visited.add(`${newRow}-${newCol}`);
        dfs(newRow, newCol, newWord, visited);
        visited.delete(`${newRow}-${newCol}`);
      }
    }
  };
  
  // Start from each cell
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const visited = new Set([`${row}-${col}`]);
      dfs(row, col, board[row][col].letter, visited);
    }
  }
  
  return Array.from(words);
};

// Get random theme and target word
const getRandomTheme = () => {
  const themes = Object.keys(THEME_WORDS);
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const themeWords = THEME_WORDS[randomTheme];
  const targetWord = themeWords[Math.floor(Math.random() * themeWords.length)];
  
  return { theme: randomTheme, targetWord };
};

// Calculate score based on word difficulty and theme
const calculateWordScore = (word, theme, targetWord) => {
  const baseScore = word.length;
  const difficulty = calculateWordDifficulty(word);
  
  // Bonus for theme-related words
  let themeBonus = 0;
  if (THEME_WORDS[theme] && THEME_WORDS[theme].includes(word)) {
    themeBonus = 5;
  }
  
  // Bonus for target word (highest score)
  if (word === targetWord) {
    return 50; // Maximum points for target word
  }
  
  // Score based on difficulty (harder words = more points)
  const difficultyScore = Math.floor(difficulty / 2);
  
  return baseScore + themeBonus + difficultyScore;
};

// Rank words by difficulty
const rankWordsByDifficulty = (words) => {
  return words
    .map(word => ({
      word,
      difficulty: calculateWordDifficulty(word)
    }))
    .sort((a, b) => a.difficulty - b.difficulty);
};

export {
  THEME_WORDS,
  calculateWordDifficulty,
  generateAllPossibleWords,
  getRandomTheme,
  calculateWordScore,
  rankWordsByDifficulty
}; 