/**
 * Game state
 */
const size = 4;
let score;
const previousHighScore = localStorage.getItem("highScore");
let highScore = previousHighScore ? previousHighScore : 0;
let gameOver = false;
let gameWon = false;
let gameState;

/**
 * Combine all possible tiles in a certain direction
 */
function combine(direction) {
  let change = false;
  const { x: xDirection, y: yDirection } = findDirection(direction);
  if (!xDirection) {
    // if x coordinate remains constant => left or right
    // iterate over all columns
    for (let x = 0; x < size; x++) {
      let previousPos;
      // iterate over each element in column
      for (let y = 0; y < size; y++) {
        const current = gameState[x][y];
        if (!current) continue;
        // check if previous and current are same
        const previous = previousPos
          ? gameState[previousPos.x][previousPos.y]
          : null;
        if (current === previous) {
          gameState[previousPos.x][previousPos.y] = 2 * current;
          score += 2 * current;
          gameState[x][y] = "";
          previousPos = null;
          change = true;
        } else {
          previousPos = { x, y };
        }
      }
    }

    // if there is a change display the new score
    if (change) {
      setNewScore();
    }
    return change;
  } else {
    // if y coordinate remains constant => up or down
    // iterate over all columns
    for (let y = 0; y < size; y++) {
      let previousPos;
      // iterate over each element in column
      for (let x = 0; x < size; x++) {
        const current = gameState[x][y];
        if (!current) continue;
        // check if previous and current are same
        const previous = previousPos
          ? gameState[previousPos.x][previousPos.y]
          : null;
        if (current === previous) {
          gameState[previousPos.x][previousPos.y] = 2 * current;
          score += 2 * current;
          gameState[x][y] = "";
          previousPos = null;
          change = true;
        } else {
          previousPos = { x, y };
        }
      }
    }

    // if there is a change display the new score
    if (change) {
      setNewScore();
    }
    // return if there is any change or not
    return change;
  }
}

/**
 * Move all tiles in a certain direction
 */
function move(direction) {
  let change = false;
  const movementFunctions = {
    up: () => {
      // iterate over all columns
      for (let y = 0; y < size; y++) {
        // iterate over each element in column
        for (let x = 0; x < size; x++) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = "";
          change = true;
        }
      }
      return change;
    },
    down: () => {
      // iterate over all columns
      for (let y = 0; y < size; y++) {
        // iterate over each element in column
        for (let x = size - 1; x >= 0; x--) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = "";
          change = true;
        }
      }
      return change;
    },
    right: () => {
      // iterate over all rows
      for (let x = 0; x < size; x++) {
        // iterate over each element in row
        for (let y = size - 1; y >= 0; y--) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = "";
          change = true;
        }
      }
      return change;
    },
    left: () => {
      // iterate over all row
      for (let x = 0; x < size; x++) {
        // iterate over each element in row
        for (let y = 0; y < size; y++) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = "";
          change = true;
        }
      }
      return change;
    },
  };
  return movementFunctions[direction]();
}

/**
 * Add tile at random empty position
 */
function addRandomTile() {
  let notFound = true;
  let flattenedGameState = gameState.flat();
  const emptyIndexes = [];
  flattenedGameState.map((val, index) => {
    if (val === "") {
      emptyIndexes.push(index);
    }
  });
  const emptyIndex = getRandomInt(emptyIndexes.length);
  const x = parseInt(emptyIndexes[emptyIndex] / size);
  const y = emptyIndexes[emptyIndex] % size;
  // fill random position with 2 or 4
  gameState[x][y] = 2 * getRandomInt(2) + 2;
}

/**
 * Get random integer from 0(inclusive) up to max(exclusive)
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Find farthest empty cell from current posititon in a direction
 */
function findFarthestEmpty(x, y, direction) {
  let nextPos = nextPosition(x, y, direction);
  let farthest = false;
  while (withinBoundary(nextPos.x, nextPos.y)) {
    // if cell empty mark it as farthest
    if (!gameState[nextPos.x][nextPos.y]) {
      farthest = { ...nextPos };
    }
    nextPos = nextPosition(nextPos.x, nextPos.y, direction);
  }
  // if there is a farthest return the furthest cell coordinates
  return farthest;
}

/**
 * Find next cell position in a certain direction
 */
function nextPosition(x, y, direction) {
  const { x: deltaX, y: deltaY } = findDirection(direction);
  return {
    x: x + deltaX,
    y: y + deltaY,
  };
}

/**
 * find parameters to add to coordinates to get next position in a particular direction
 */
function findDirection(direction) {
  const allDirections = {
    up: {
      x: -1,
      y: 0,
    },
    down: {
      x: 1,
      y: 0,
    },
    left: {
      x: 0,
      y: -1,
    },
    right: {
      x: 0,
      y: 1,
    },
  };
  return allDirections[direction];
}

/**
 * Checks whether coordinates are within boundary
 */
function withinBoundary(x, y) {
  return x >= 0 && x < size && y >= 0 && y < size;
}

/**
 * Set the new score
 */
function setNewScore() {
  document.getElementById("score").innerHTML = score;
  if (score > highScore) {
    highScore = score;
    if (highScore > previousHighScore)
      localStorage.setItem("highScore", highScore);
    document.getElementById("high-score").innerHTML = score;
  }
}

/**
 * Check if there are any empty cells
 */
function emptyCells() {
  const flattenedGameState = gameState.flat();
  let found = false;
  for (let i = 0; i < flattenedGameState.length; i++) {
    if (!flattenedGameState[i]) {
      found = true;
      break;
    }
  }
  return found;
}

/**
 * Check if there is any possible combination of cells
 */
function possibleCombination() {
  // check adjacent horizontally and vertically
  for (let x = 0; x < size; x++) {
    let previousX;
    let previousY;
    for (let y = 0; y < size; y++) {
      const currentX = gameState[x][y];
      const currentY = gameState[y][x];
      if (!currentX && !currentY) continue;
      if (currentX === previousX || currentY === previousY) {
        return true;
      } else {
        // store previous values to check for possible combination
        previousX = currentX ? currentX : previousX;
        previousY = currentY ? currentY : previousY;
      }
    }
  }
  // no possible combination return false
  return false;
}

/**
 * Check if game over
 */
function isGameOver() {
  // if no empty cells and no possible combination of cells
  const status = !emptyCells() && !possibleCombination();
  if (status) {
    document.getElementById("game-over").innerHTML = "Game Over!!";
  }
}

/*
 * Display the current state of the matrix
 */
function currentMatrix() {
  let wonGame = false;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      document.getElementById(x + "," + y).innerHTML = gameState[x][y];
      if (gameState[x][y] === 128) {
        gameWon = true;
        document.getElementById("game-won").innerHTML =
          "Congratulations!! You Won!!";
      }
    }
  }
}

/**
 * Add event listener that takes action based on key pressed
 */
function addListener() {
  console.log("added event listener");
  document.body.addEventListener("keydown", (e) => {
    const direction = {
      arrowup: "up",
      arrowdown: "down",
      arrowleft: "left",
      arrowright: "right",
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    };
    const pressedKeyDirection = direction[e.key.toLowerCase()];
    // if correct key pressed and game is not over
    if (pressedKeyDirection && !gameOver && !gameWon) {
      // combine tiles and move all tiles in the direction pressed
      combine(pressedKeyDirection);
      move(pressedKeyDirection);
      // only if there is an empty cell add a new random tile
      const emptyCellsPresent = emptyCells();
      if (emptyCellsPresent) {
        addRandomTile();
      }
      // show current matrix and also check if game won
      currentMatrix();
      // check if game is over
      gameOver = isGameOver();
    }
  });
}

/**
 * Initialize/reset game with starting values
 */
function initState() {
  // fetch previous high score
  document.getElementById("high-score").innerHTML = localStorage.getItem(
    "highScore"
  )
    ? localStorage.getItem("highScore")
    : 0;
  // fill array with empty cells
  gameState = Array(size)
    .fill()
    .map((row) => Array(size).fill(""));
  // reset game over and game won
  gameOver = false;
  gameWon = false;
  document.getElementById("game-over").innerHTML = "";
  document.getElementById("game-won").innerHTML = "";
  // reset score
  score = 0;
  setNewScore();
}

/**
 * Start a new game
 */
function start(reset = false) {
  initState();
  if (!reset) {
    addListener();
  }
  addRandomTile();
  addRandomTile();
  currentMatrix();
}

/**
 * Restart game functionality
 */
document.getElementById("restart").addEventListener("click", () => {
  start(true);
});

/**
 * Start game after page loaded
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("dom content loaded");
  start();
});
