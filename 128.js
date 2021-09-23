// game state
const size = 3;
const gameState = Array(size)
  .fill()
  .map((row) => Array(size).fill(0));

// combine all in a certain direction
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
          gameState[x][y] = 0;
          previousPos = null;
          change = true;
        } else {
          previousPos = { x, y };
        }
      }
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
          gameState[x][y] = 0;
          previousPos = null;
          change = true;
        } else {
          previousPos = { x, y };
        }
      }
    }
    return change;
  }
}

// move all tiles in a certain direction
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
          gameState[x][y] = 0;
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
          gameState[x][y] = 0;
          change = true;
        }
      }
      return change;
    },
    right: () => {
      // iterate over all rows
      for (let x = 0; x < size; x++) {
        // iterate over each element in row
        for (let y = 0; y < size; y++) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = 0;
          change = true;
        }
      }
      return change;
    },
    left: () => {
      // iterate over all row
      for (let x = 0; x < size; x++) {
        // iterate over each element in row
        for (let y = size - 1; y >= 0; y--) {
          const current = gameState[x][y];
          if (!current) continue;
          const next = findFarthestEmpty(x, y, direction);
          if (!next) continue;
          gameState[next.x][next.y] = current;
          gameState[x][y] = 0;
          change = true;
        }
      }
      return change;
    },
  };
  return movementFunctions[direction]();
}

//
function addRandomTile() {
  let notFound = true;
  let cell;
  let flattenedGameState = gameState.flat();
  let x;
  let y;
  while (notFound) {
    const random = getRandomInt(9);
    console.log(random);
    if (flattenedGameState[random] === 0) {
      x = parseInt(random / size);
      y = random % size;
      notFound = false;
    }
  }
  console.log(x, y);
  gameState[x][y] = 2;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// find farthest empty from current posititon in a direction
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

// find next position in a certain direction
function nextPosition(x, y, direction) {
  const { x: deltaX, y: deltaY } = findDirection(direction);
  return {
    x: x + deltaX,
    y: y + deltaY,
  };
}

// find parameters to add to coordinates to get next position in a particular direction
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

// checks whether coordinates are within boundary
function withinBoundary(x, y) {
  return x >= 0 && x < size && y >= 0 && y < size;
}

function showMatrix() {
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      document.getElementById(x + "," + y).innerHTML = gameState[x][y];
    }
  }
}

function start() {
  listen();
  addRandomTile();
  addRandomTile();
  showMatrix();
}

function listen() {
  document.addEventListener("keydown", (e) => {
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
    if (pressedKeyDirection) {
      combine(pressedKeyDirection);
      move(pressedKeyDirection);
      addRandomTile();
      showMatrix();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  start();
});