/* -----------------------
Game set-up
------------------------ */

const grid = document.querySelector(".grid");
const stackBtn = document.querySelector(".stack");
const scoreCounter = document.querySelector(".score-counter");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector(".play-again");

const gridMatrix = [
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 0],
];

let currentRowIndex = gridMatrix.length - 1;
let barDirection = "right";
let barSize = 3;
let isGameOver = false;
let score = 0;
let t;

/* -----------------------
Functions
----------------------- */

// Function to draw the board
function draw() {
  // Reset grid
  grid.innerHTML = "";

  gridMatrix.forEach(function (rowContent, rowIndex) {
    rowContent.forEach(function (cellContent, cellIndex) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Assign dark colour to cells
      const isRowEven = rowIndex % 2 === 0;
      const isCellEven = cellIndex % 2 === 0;

      if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
        cell.classList.add("cell-dark");
      }

      // If the cell is part of the bar
      if (cellContent === 1) {
        cell.classList.add("bar");
      }

      grid.appendChild(cell);
    });
  });
}

// Function to move the bar to the right
function moveRight(row) {
  row.pop();
  row.unshift(0);
}

// Function to move the bar to the left
function moveLeft(row) {
  row.shift();
  row.push(0);
}

// Function to check if the bar has reached the right edge
function isRightEdge(row) {
  const lastElement = row[row.length - 1];
  return lastElement === 1;
}

// Function to check if the bar has reached the left edge
function isLeftEdge(row) {
  const firstElement = row[0];
  return firstElement === 1;
}

// Function to move the bar in the right direction
function moveBar() {
  const currentRow = gridMatrix[currentRowIndex];

  if (barDirection === "right") {
    moveRight(currentRow);
    if (isRightEdge(currentRow)) {
      barDirection = "left";
    }
  } else if (barDirection === "left") {
    moveLeft(currentRow);
    if (isLeftEdge(currentRow)) {
      barDirection = "right";
    }
  }
}

// Function to check if user has lost
function checkLost() {
  const currentRow = gridMatrix[currentRowIndex];
  const prevRow = gridMatrix[currentRowIndex + 1];
  if (!prevRow) return;

  for (let i = 0; i < currentRow.length; i++) {
    // If the element in the row below is not part of the bar
    if (currentRow[i] === 1 && prevRow[i] === 0) {
      // Remove the element from the current row
      currentRow[i] = 0;
      barSize--;

      // Check if game over
      if (barSize === 0) {
        isGameOver = true;
        clearInterval(t);
        endGame(false);
      }
    }
  }
}

// Function to check if user has won
function checkWin() {
  if (currentRowIndex === 0) {
    isGameOver = true;
    clearInterval(t);
    endGame(true);
  }
}

// Function to execute when stacking
function onStack() {
  updateScore();

  // Check if game over
  checkLost();
  checkWin();
  if (isGameOver) return;

  currentRowIndex = currentRowIndex - 1;
  barDirection = "right";

  // Stack
  for (let i = 0; i < barSize; i++) {
    gridMatrix[currentRowIndex][i] = 1;
  }

  draw();
}

// Function to update score
function updateScore() {
  // Scoring based on stacked blocks
  const finalBlock = document.querySelectorAll(".bar");
  scoreCounter.innerText = finalBlock.length.toString().padStart(5, "0");

  // // Scoring based on stacked rows
  // score++;
  // scoreCounter.innerText = String(score).padStart(5, "0");
}

// Function to end the game
function endGame(isVictory) {
  // Show end-game screen
  endGameScreen.classList.remove("hidden");

  // If user has won
  if (isVictory === true) {
    stackBtn.classList.add("invisible");
    endGameScreen.classList.add("win");
    endGameText.innerHTML = "YOU<br>WIN";

    // If user has lost
  } else if (isVictory === false) {
    stackBtn.classList.add("invisible");
    endGameScreen.classList.add("lose");
    endGameText.innerHTML = "GAME<br>OVER";
  }
}

// Function to reload the game
function playAgain() {
  location.reload();
}

// Function to display game loop
function main() {
  moveBar();
  draw();
}

/* -----------------------
Events
----------------------- */

// Event listener for the "Stack" button click
stackBtn.addEventListener("click", onStack);

// Event listener for the "Play Again" button click
playAgainButton.addEventListener("click", playAgain);

/* -----------------------
Game logic
----------------------- */

// First draw
draw();

// Start game loop
t = setInterval(main, 600);
