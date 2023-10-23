/* -----------------------
Game set-up
------------------------ */

const scoreCounter = document.querySelector(".score-counter");
const grid = document.querySelector(".grid");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector(".play-again");

const totalCells = 100;
const totalBombs = 16;
const maxScore = totalCells - totalBombs;
const bombsList = [];
let score = 0;
let isCellEven = false;
let isRowEven = false;

// Generate bombs randomly
while (bombsList.length < totalBombs) {
  const number = Math.floor(Math.random() * totalCells) + 1;
  if (!bombsList.includes(number)) bombsList.push(number);
}
// console.log(bombsList); // for testing

// Set up grid and game logic
for (let i = 1; i <= totalCells; i++) {
  const cell = document.createElement("div");
  cell.classList.add("cell");

  // Assign dark colour to cells
  isCellEven = i % 2 === 0;
  if ((isRowEven && isCellEven) || (!isRowEven && !isCellEven)) {
    cell.classList.add("cell-dark");
  }
  if (i % 10 === 0) isRowEven = !isRowEven;

  cell.addEventListener("click", function () {
    if (cell.classList.contains("cell-clicked")) {
      // If the cell has already been clicked
      return;
    } else if (bombsList.includes(i)) {
      // If the cell is a bomb
      cell.classList.add("cell-bomb");
      endGame(false); // User has lost
    } else {
      // If the cell is not a bomb
      cell.classList.add("cell-clicked");
      updateScore();
    }
  });

  grid.appendChild(cell);
}

/* -----------------------
Functions
----------------------- */

// Function to update score
function updateScore() {
  score++;
  scoreCounter.innerText = String(score).padStart(5, 0);

  // Check if user has won
  if (score === maxScore) endGame(true);
}

// Function to end the game
function endGame(isVictory) {
  // Show end-game screen
  endGameScreen.classList.remove("hidden");
  revealAllBombs();

  if (isVictory === true) {
    // If user has won
    endGameScreen.classList.add("win");
    endGameText.innerHTML = "YOU<br>WIN";
  } else if (isVictory === false) {
    // If user has lost
    endGameScreen.classList.add("lose");
    endGameText.innerHTML = "GAME<br>OVER";
  }
}

// Function to reveal all bombs
function revealAllBombs() {
  const cells = document.querySelectorAll(".cell");
  for (let i = 1; i <= cells.length; i++) {
    if (bombsList.includes(i)) {
      const cellToReveal = cells[i - 1];
      cellToReveal.classList.add("cell-bomb");
    }
  }
}

// Function to reload the game
function playAgain() {
  location.reload();
}

/* -----------------------
Events
----------------------- */

// Event listener for the "Play Again" button click
playAgainButton.addEventListener("click", playAgain);
