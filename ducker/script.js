/* -----------------------
Game set-up
------------------------ */

// Collect all the elements of interest from the page
const grid = document.querySelector(".grid");
const scoreCounter = document.querySelector(".score-counter");
const endGameScreen = document.querySelector(".end-game-screen");
const endGameText = document.querySelector(".end-game-text");
const playAgainButton = document.querySelector(".play-again");

// Create the matrix for our grid
const gridMatrix = [
  ["", "", "", "", "", "", "", "", ""],
  ["river", "wood", "wood", "river", "wood", "river", "river", "river", "river"],
  ["river", "river", "river", "wood", "wood", "river", "wood", "wood", "river"],
  ["", "", "", "", "", "", "", "", ""],
  ["road", "bus", "road", "road", "road", "car", "road", "road", "road"],
  ["road", "road", "road", "car", "road", "road", "road", "road", "bus"],
  ["road", "road", "car", "road", "road", "road", "bus", "road", "road"],
  ["", "", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", "", ""],
];

// Prepare some game logic information
const victoryRow = 0;
const riverRows = [1, 2];
const roadRows = [4, 5, 6];
const duckPosition = { y: 8, x: 4 };
let contentBeforeDuck = "";
let time = 15;

/* -----------------------
Functions
----------------------- */

// Function to style the cells
function applyCellStyle(element, rowIndex, cellIndex) {
  const isRowEven = rowIndex % 2 === 0;
  const isCellEven = cellIndex % 2 === 0;

  if (isRowEven && isCellEven) element.classList.add("cell-dark");
  else if (!isRowEven && !isCellEven) element.classList.add("cell-dark");
}

// Function to draw the grid
function drawGrid() {
  // Clear previous contents
  grid.innerHTML = "";

  gridMatrix.forEach(function (rowCells, rowIndex) {
    rowCells.forEach(function (cellContent, cellIndex) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      // Add a class with the same name as the cell's content
      if (cellContent !== "") cell.classList.add(cellContent);

      // Apply appropriate row coloring
      if (riverRows.includes(rowIndex)) {
        cell.classList.add("river");
      } else if (roadRows.includes(rowIndex)) {
        cell.classList.add("road");
      } else applyCellStyle(cell, rowIndex, cellIndex);

      grid.appendChild(cell);
    });
  });
}

// Function to place the duck
function placeDuck() {
  // Store the content before placing the duck
  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];

  // Place the duck in the specified position
  gridMatrix[duckPosition.y][duckPosition.x] = "duck";
}

// Function to move the duck
function moveDuck(event) {
  // Restore the previous cell's content
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;

  // Update the position of the elements
  switch (event.key) {
    case "ArrowUp":
      if (duckPosition.y > 0) duckPosition.y--;
      break;
    case "ArrowDown":
      if (duckPosition.y < 8) duckPosition.y++;
      break;
    case "ArrowLeft":
      if (duckPosition.x > 0) duckPosition.x--;
      break;
    case "ArrowRight":
      if (duckPosition.x < 8) duckPosition.x++;
      break;
    default:
      return;
  }

  // Redraw everything
  drawElements();
}

// Function to move the duck and redraw the grid
function drawElements() {
  placeDuck();
  checkDuckPosition();
  drawGrid();
}

// Function to end the game
function endGame(reason) {
  if (reason === "duck-arrived") {
    endGameScreen.classList.add("win");
    endGameText.innerHTML = "YOU<br>WIN";
  } else {
    endGameScreen.classList.add("lose");
    endGameText.innerHTML = "GAME<br>OVER";
  }
  // Stop element movement
  clearInterval(renderingLoop);

  // Stop the countdown
  clearInterval(countdown);

  // Remove key event listener
  document.removeEventListener("keyup", moveDuck);

  // Assign the appropriate class
  gridMatrix[duckPosition.y][duckPosition.x] = reason;

  // Display the end game screen
  endGameScreen.classList.remove("hidden");

  // Focus on the "Play Again" button
  playAgainButton.focus();
}

// Function to check the duck's position
function checkDuckPosition() {
  if (duckPosition.y === victoryRow) endGame("duck-arrived");
  else if (contentBeforeDuck === "river") endGame("duck-drowned");
  else if (contentBeforeDuck === "bus" || contentBeforeDuck === "car") {
    endGame("duck-hit");
  }
}

// Function to move a row
function moveRow(rowIndex) {
  const rowCells = gridMatrix[rowIndex];
  // Remove the last cell and set it aside
  const lastCell = rowCells.pop();
  // Place it at the beginning
  rowCells.unshift(lastCell);
}

// Function to move a row backward
function moveRowBack(rowIndex) {
  const rowCells = gridMatrix[rowIndex];
  // Remove the first cell and set it aside
  const firstCell = rowCells.shift();
  // Add it to the end
  rowCells.push(firstCell);
}

// Function to handle the duck's position
function handleDuckPosition() {
  gridMatrix[duckPosition.y][duckPosition.x] = contentBeforeDuck;
  // Handle floating behavior
  if (contentBeforeDuck === "wood") {
    // If on the first row and not at the end, move right
    if (duckPosition.y === 1 && duckPosition.x < 8) duckPosition.x++;
    // If on the second row and not at the beginning, move left
    else if (duckPosition.y === 2 && duckPosition.x > 0) duckPosition.x--;
  }

  contentBeforeDuck = gridMatrix[duckPosition.y][duckPosition.x];
}

// Function to reduce time left
function reduceTime() {
  time--;
  scoreCounter.innerText = String(time).padStart(5, "0");
  if (time === 0) endGame("time-up");
}

// Function to reload the game
function playAgain() {
  location.reload();
}

/* -----------------------
Events
----------------------- */

// Event listener for key presses
document.addEventListener("keyup", moveDuck);

// Event listener for the "Play Again" button click
playAgainButton.addEventListener("click", playAgain);

/* -----------------------
Game logic
----------------------- */

const renderingLoop = setInterval(function () {
  handleDuckPosition();
  moveRow(1);
  moveRowBack(2);
  moveRow(4);
  moveRow(5);
  moveRow(6);
  drawElements();
}, 600);

const countdown = setInterval(reduceTime, 1000);
