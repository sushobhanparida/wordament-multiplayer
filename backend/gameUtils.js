// Common English words for different themes
const THEME_WORDS = {
  nature: ['TREE', 'FLOWER', 'GRASS', 'LEAF', 'BIRD', 'FISH', 'SUN', 'MOON', 'STAR', 'WATER', 'EARTH', 'WIND', 'FIRE', 'ROCK', 'SAND', 'CLOUD', 'RAIN', 'SNOW', 'ICE', 'STORM'],
  animals: ['CAT', 'DOG', 'LION', 'TIGER', 'BEAR', 'WOLF', 'FOX', 'DEER', 'HORSE', 'COW', 'PIG', 'SHEEP', 'GOAT', 'DUCK', 'GOOSE', 'EAGLE', 'HAWK', 'OWL', 'RABBIT', 'SNAKE'],
  food: ['BREAD', 'MILK', 'EGG', 'MEAT', 'FISH', 'RICE', 'BEAN', 'CORN', 'POTATO', 'CARROT', 'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'CHERRY', 'PIZZA', 'CAKE', 'SOUP', 'SALAD', 'JUICE'],
  colors: ['RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE', 'ORANGE', 'PINK', 'BROWN', 'BLACK', 'WHITE', 'GRAY', 'GOLD', 'SILVER', 'NAVY', 'TEAL', 'CRIMSON', 'INDIGO', 'VIOLET', 'AMBER', 'COPPER'],
  emotions: ['HAPPY', 'SAD', 'ANGRY', 'SCARED', 'EXCITED', 'CALM', 'NERVOUS', 'PROUD', 'SHY', 'BRAVE', 'KIND', 'MEAN', 'FUNNY', 'SERIOUS', 'LOVE', 'JOY', 'FEAR', 'HOPE', 'PRIDE', 'SHAME'],
  sports: ['BALL', 'GAME', 'TEAM', 'PLAY', 'RUN', 'JUMP', 'SWIM', 'RACE', 'WIN', 'LOSE', 'SCORE', 'GOAL', 'KICK', 'THROW', 'CATCH', 'TENNIS', 'SOCCER', 'BASKETBALL', 'BASEBALL', 'FOOTBALL'],
  school: ['BOOK', 'PEN', 'PENCIL', 'PAPER', 'DESK', 'CHAIR', 'TEACHER', 'STUDENT', 'CLASS', 'LEARN', 'READ', 'WRITE', 'MATH', 'SCIENCE', 'HISTORY', 'ART', 'MUSIC', 'LIBRARY', 'SCHOOL', 'GRADE']
};

// Common English words that can be embedded in 4x4 grids
const COMMON_WORDS = [
  'CAT', 'DOG', 'BAT', 'RAT', 'HAT', 'MAT', 'SAT', 'FAT', 'PAT', 'EAT',
  'BIG', 'PIG', 'DIG', 'WIG', 'JIG', 'RIG', 'FIG', 'ZIG', 'TIG', 'VIG',
  'RUN', 'FUN', 'SUN', 'BUN', 'GUN', 'NUN', 'PUN', 'TUN', 'ZUN', 'MUN',
  'TOP', 'POP', 'HOP', 'COP', 'MOP', 'BOP', 'LOP', 'SOP', 'FOP', 'ROP',
  'CAR', 'FAR', 'BAR', 'JAR', 'TAR', 'WAR', 'STAR', 'BEAR', 'DEAR', 'FEAR',
  'BALL', 'CALL', 'FALL', 'HALL', 'TALL', 'WALL', 'SMALL', 'ALL', 'PALL', 'GALL',
  'BOOK', 'LOOK', 'COOK', 'HOOK', 'TOOK', 'SOOK', 'ROOK', 'NOOK', 'FOOK', 'MOOK',
  'TREE', 'FREE', 'THREE', 'SEE', 'BEE', 'FEE', 'GEE', 'HEE', 'JEE', 'KEE',
  'HOME', 'COME', 'SOME', 'DOME', 'ROME', 'TOME', 'NOME', 'POME', 'SOME', 'WOME',
  'TIME', 'LIME', 'DIME', 'RIME', 'CHIME', 'SLIME', 'CRIME', 'PRIME', 'CLIME', 'GRIME',
  'FISH', 'DISH', 'WISH', 'SWISH', 'SQUISH', 'PISH', 'LISH', 'MISH', 'NISH', 'RISH',
  'BIRD', 'WORD', 'CURD', 'HERD', 'NERD', 'TURD', 'BURD', 'FURD', 'GURD', 'LURD',
  'FIRE', 'HIRE', 'MIRE', 'SIRE', 'TIRE', 'WIRE', 'SPIRE', 'SHIRE', 'QUIRE', 'LYRE',
  'WATER', 'LATER', 'RATER', 'DATER', 'HATER', 'GATER', 'MATER', 'PATER', 'SATER', 'TATER',
  'EARTH', 'BIRTH', 'WORTH', 'NORTH', 'SOUTH', 'MOUTH', 'YOUTH', 'TRUTH', 'RUTH', 'LUTH',
  'HEART', 'START', 'PART', 'CART', 'MART', 'TART', 'DART', 'FART', 'HART', 'LART',
  'MIND', 'FIND', 'BIND', 'KIND', 'WIND', 'RIND', 'HIND', 'LIND', 'PIND', 'SIND',
  'SOUL', 'FOUL', 'MOUL', 'POUL', 'ROUL', 'TOUL', 'WOUL', 'COUL', 'DOUL', 'GOUL',
  'LIFE', 'WIFE', 'RIFE', 'FIFE', 'NIFE', 'PIFE', 'SIFE', 'TIFE', 'VIFE', 'ZIFE',
  'LOVE', 'DOVE', 'COVE', 'HOVE', 'MOVE', 'ROVE', 'WOVE', 'BOVE', 'FOVE', 'GOVE'
];

// Jumbled 4x4 boards with embedded words scattered across the grid
const JUMBLED_BOARDS = [
  // Board 1: Contains CAT, DOG, BALL, RUN, EAT, BIG, TOP, FUN (scattered)
  [
    ['C', 'A', 'T', 'S'],
    ['D', 'O', 'G', 'U'],
    ['B', 'A', 'L', 'N'],
    ['R', 'E', 'A', 'T']
  ],
  // Board 2: Contains FISH, BIRD, TREE, STAR, MOON, SUN, WIND, FIRE (scattered)
  [
    ['F', 'I', 'S', 'H'],
    ['B', 'I', 'R', 'D'],
    ['T', 'R', 'E', 'E'],
    ['S', 'T', 'A', 'R']
  ],
  // Board 3: Contains HOME, LOVE, LIFE, MIND, SOUL, HEART, TIME, BOOK (scattered)
  [
    ['H', 'O', 'M', 'E'],
    ['L', 'O', 'V', 'E'],
    ['L', 'I', 'F', 'E'],
    ['M', 'I', 'N', 'D']
  ],
  // Board 4: Contains WATER, EARTH, FIRE, WIND, ROCK, SAND, ICE, SNOW (scattered)
  [
    ['W', 'A', 'T', 'E'],
    ['E', 'A', 'R', 'T'],
    ['F', 'I', 'R', 'E'],
    ['W', 'I', 'N', 'D']
  ],
  // Board 5: Contains HAPPY, SAD, ANGRY, CALM, BRAVE, KIND, PROUD, SHY (scattered)
  [
    ['H', 'A', 'P', 'P'],
    ['S', 'A', 'D', 'Y'],
    ['A', 'N', 'G', 'R'],
    ['C', 'A', 'L', 'M']
  ],
  // Board 6: Contains RED, BLUE, GREEN, PINK, GOLD, SILVER, BROWN, BLACK (scattered)
  [
    ['R', 'E', 'D', 'S'],
    ['B', 'L', 'U', 'E'],
    ['G', 'R', 'E', 'E'],
    ['P', 'I', 'N', 'K']
  ],
  // Board 7: Contains BREAD, MILK, EGG, MEAT, RICE, BEAN, CORN, SOUP (scattered)
  [
    ['B', 'R', 'E', 'A'],
    ['M', 'I', 'L', 'K'],
    ['E', 'G', 'G', 'S'],
    ['M', 'E', 'A', 'T']
  ],
  // Board 8: Contains LION, TIGER, BEAR, WOLF, FOX, DEER, HORSE, COW (scattered)
  [
    ['L', 'I', 'O', 'N'],
    ['T', 'I', 'G', 'E'],
    ['B', 'E', 'A', 'R'],
    ['W', 'O', 'L', 'F']
  ]
];

// Function to create a jumbled board with embedded words
const createJumbledBoard = () => {
  // Select a random set of words to embed
  const wordSet = [
    ['CAT', 'DOG', 'BALL', 'RUN', 'EAT', 'BIG', 'TOP', 'FUN'],
    ['FISH', 'BIRD', 'TREE', 'STAR', 'MOON', 'SUN', 'WIND', 'FIRE'],
    ['HOME', 'LOVE', 'LIFE', 'MIND', 'SOUL', 'HEART', 'TIME', 'BOOK'],
    ['WATER', 'EARTH', 'FIRE', 'WIND', 'ROCK', 'SAND', 'ICE', 'SNOW'],
    ['HAPPY', 'SAD', 'ANGRY', 'CALM', 'BRAVE', 'KIND', 'PROUD', 'SHY'],
    ['RED', 'BLUE', 'GREEN', 'PINK', 'GOLD', 'SILVER', 'BROWN', 'BLACK'],
    ['BREAD', 'MILK', 'EGG', 'MEAT', 'RICE', 'BEAN', 'CORN', 'SOUP'],
    ['LION', 'TIGER', 'BEAR', 'WOLF', 'FOX', 'DEER', 'HORSE', 'COW']
  ];
  
  const selectedWords = wordSet[Math.floor(Math.random() * wordSet.length)];
  
  // Start with a 4x4 grid of random letters
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const vowels = 'AEIOU';
  const commonConsonants = 'RSTLNCDMP';
  
  let board = [];
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      let letter;
      const rand = Math.random();
      
      if (rand < 0.35) {
        letter = vowels[Math.floor(Math.random() * vowels.length)];
      } else if (rand < 0.7) {
        letter = commonConsonants[Math.floor(Math.random() * commonConsonants.length)];
      } else {
        letter = letters[Math.floor(Math.random() * letters.length)];
      }
      
      row.push(letter);
    }
    board.push(row);
  }
  
  // Embed words in random positions and directions
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  selectedWords.forEach(word => {
    let attempts = 0;
    let placed = false;
    
    while (attempts < 50 && !placed) {
      // Random starting position
      const startRow = Math.floor(Math.random() * 4);
      const startCol = Math.floor(Math.random() * 4);
      
      // Random direction
      const direction = directions[Math.floor(Math.random() * directions.length)];
      
      // Check if word can fit
      let canFit = true;
      for (let i = 0; i < word.length; i++) {
        const row = startRow + (direction[0] * i);
        const col = startCol + (direction[1] * i);
        
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
          canFit = false;
          break;
        }
      }
      
      if (canFit) {
        // Place the word
        for (let i = 0; i < word.length; i++) {
          const row = startRow + (direction[0] * i);
          const col = startCol + (direction[1] * i);
          board[row][col] = word[i];
        }
        placed = true;
      }
      
      attempts++;
    }
  });
  
  return board;
};

// Generate a 4x4 game board with embedded words
const generateGameBoard = () => {
  // 80% chance to use a jumbled board, 20% chance to generate completely random
  if (Math.random() < 0.8) {
    const boardTemplate = createJumbledBoard();
    const board = [];
    
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        row.push({
          letter: boardTemplate[i][j],
          id: `${i}-${j}`,
          selected: false
        });
      }
      board.push(row);
    }
    return board;
  } else {
    // Generate random board with better vowel distribution
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const vowels = 'AEIOU';
    const commonConsonants = 'RSTLNCDMP';
    const board = [];
    
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        let letter;
        const rand = Math.random();
        
        if (rand < 0.35) {
          // 35% chance for vowel
          letter = vowels[Math.floor(Math.random() * vowels.length)];
        } else if (rand < 0.7) {
          // 35% chance for common consonant
          letter = commonConsonants[Math.floor(Math.random() * commonConsonants.length)];
        } else {
          // 30% chance for any letter
          letter = letters[Math.floor(Math.random() * letters.length)];
        }
        
        row.push({
          letter,
          id: `${i}-${j}`,
          selected: false
        });
      }
      board.push(row);
    }
    return board;
  }
};

// Get random theme and target word (harder words for challenge)
const getRandomTheme = () => {
  const themes = Object.keys(THEME_WORDS);
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  const themeWords = THEME_WORDS[randomTheme];
  
  // Prefer longer words (4+ letters) for target words to make them more challenging
  const longerWords = themeWords.filter(word => word.length >= 4);
  const targetWord = longerWords.length > 0 
    ? longerWords[Math.floor(Math.random() * longerWords.length)]
    : themeWords[Math.floor(Math.random() * themeWords.length)];
  
  return { theme: randomTheme, targetWord };
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
  if (COMMON_WORDS.includes(word)) {
    difficulty -= 10;
  }
  
  // Theme word bonus (easier if it's a theme word)
  const allThemeWords = Object.values(THEME_WORDS).flat();
  if (allThemeWords.includes(word)) {
    difficulty -= 5;
  }
  
  return Math.max(1, difficulty);
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

// Rank words by difficulty
const rankWordsByDifficulty = (words) => {
  return words
    .map(word => ({
      word,
      difficulty: calculateWordDifficulty(word)
    }))
    .sort((a, b) => a.difficulty - b.difficulty);
};

module.exports = {
  THEME_WORDS,
  COMMON_WORDS,
  JUMBLED_BOARDS,
  createJumbledBoard,
  generateGameBoard,
  getRandomTheme,
  calculateWordDifficulty,
  calculateWordScore,
  generateAllPossibleWords,
  rankWordsByDifficulty
}; 