/**
 * Memory Tile Game
 * 
 * @file js/script.js
 * @author Jason Yang
 * @student_number 400567902
 * @date 02/16/2025
 * @description This file handles the logic for the game, including game initialization, level progression, and player interactions.
 */

// Player Info
let player = {
    name: "",
    age: "",
    color: "#000000"
};

// Game Variables
let lives = 3;
let level = 1;
let gridSize = 2;
let tileFlash = [];

// Level Configuration
const levelConfig = [
    [2, 1], // Level 1
    [2, 2], // Level 2
    [3, 3], // Level 3
    [3, 4], // Level 4
    [3, 5], // Level 5
    [4, 3], // Level 6
    [4, 4], // Level 7
    [4, 5], // Level 8
    [4, 6], // Level 9
    [4, 7], // Level 10
];

/**
 * Checks if the form inputs are valid and enables/disables the start button accordingly.
 */
function checkFormValidity() {
    const startButton = document.getElementById("startButton");
    const playerName = document.getElementById("playerName").value;
    const playerAge = document.getElementById("playerAge").value;
    const playerColor = document.getElementById("playerColor").value;

    const isValid = playerName !== "" && playerAge > 0;
    startButton.disabled = !isValid;
}

/**
 * Initializes event listeners when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const helpButton = document.getElementById("helpButton");
    const backButton = document.getElementById("backButton");
    const restartButton = document.getElementById("restartButton");
    const restartButtonGameOver = document.getElementById("playAgain");

    // Show help screen when the help button is clicked.
    helpButton.addEventListener("click", function (event) {
        showScreen("helpScreen");
    });

    // Go back to the game screen from the help screen.
    backButton.addEventListener("click", function (event) {
        showScreen("gameScreen");
    });

    // Restart the game from in-game screen.
    restartButton.addEventListener("click", function (event) {
        restartGame();
    });

    // Restart the game from game-over screen.
    restartButtonGameOver.addEventListener("click", function (event) {
        restartGame();
    });

    // Handle form submission and initialize game.
    const introForm = document.getElementById("introForm");
    introForm.addEventListener("submit", initializeGame);

    // Enable/disable start button based on input changes.
    document.querySelectorAll("#playerName, #playerAge").forEach(input => {
        input.oninput = checkFormValidity;
    });
});

/**
 * Displays the specified screen while hiding the others.
 * 
 * @param {string} screenId - The ID of the screen to display
 */
function showScreen(screenId) {
    document.getElementById("introScreen").style.display = "none";
    document.getElementById("helpScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";

    document.getElementById(screenId).style.display = "block";

    const helpButton = document.getElementById("helpButton");
    if (screenId === "gameScreen") {
        helpButton.style.display = "block";
    } else {
        helpButton.style.display = "none";
    }
}

/**
 * Initializes the game based on the player's inputs.
 * 
 * @param {Event} event - The submit event of the form
 */
function initializeGame(event) {
    event.preventDefault();
    
    player.name = document.getElementById("playerName").value;
    player.age = parseInt(document.getElementById("playerAge").value, 10);
    player.color = document.getElementById("playerColor").value;

    document.getElementById("playerNameDisplay").innerText = `Name: ${player.name}`;
    document.getElementById("playerAgeDisplay").innerText = `Age: ${player.age}`;

    showScreen("gameScreen");

    startNewLevel();
}

/**
 * Starts a new level, resetting necessary variables.
 */
function startNewLevel() {
    if (level > levelConfig.length) {
        endGame(true);
        return;
    }

    const [newGridSize, numFlashes] = levelConfig[level - 1];

    gridSize = newGridSize;

    document.getElementById("level").innerText = level;

    createGameBoard(gridSize);

    setTimeout(() => {
        flashTiles(level);
    }, 0);
}

/**
 * Creates the game board with the specified grid size.
 * 
 * @param {number} gridsize - The size of the grid
 */
function createGameBoard(gridSize) {
    let board = document.getElementById("gameBoard");
    board.innerHTML = "";

    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    let numTiles = gridSize * gridSize;
    let tileClass = "";

    if (gridSize === 2) {
        tileClass = "large";
    } else if (gridSize === 3) {
        tileClass = "medium";
    } else {
        tileClass = "small";
    }

    for (let i = 0; i < numTiles; i++) {
        let tile = document.createElement("div");
        tile.classList.add("tile");
        tile.classList.add(tileClass);
        tile.dataset.index = i;
        tile.addEventListener("click", handleTileClick);
        board.appendChild(tile);
    }
}

/**
 * Flash randm tiles for the current level.
 * 
 * @param {number} numFlashes - The number of tiles to flash
 */
function flashTiles(numFlashes) {
    tileFlash = [];
    let tiles = document.querySelectorAll(".tile");
    let flashColor = player.color || "#ffffff";

    tiles.forEach(tile => tile.style.backgroundColor = "#ccc");

    while (tileFlash.length < numFlashes) {
        let randomIndex = Math.floor(Math.random() * tiles.length);
        if (!tileFlash.includes(randomIndex)) {
            tileFlash.push(randomIndex);
            tiles[randomIndex].style.backgroundColor = flashColor;
        }
    }

    tileFlash.forEach(index => {
        setTimeout(() => {
            tiles[index].style.backgroundColor = flashColor;
        }, 100);
        setTimeout(() => {
            tiles[index].style.backgroundColor = "#ccc";
        }, 750);
    });
}

/**
 * Creates a flashing effect on the screen to indicate the current level is complete.
 */
function flashScreen() {
    let gameScreen = document.getElementById("gameScreen");
    gameScreen.style.backgroundColor = "white";

    setTimeout(() => {
        gameScreen.style.backgroundColor = "";
    }, 300);
}

/**
 * Briefly shakes the game screen to indicate a wrong press.
 */
function wrongPress() {
    let gameScreen = document.getElementById("gameScreen");

    gameScreen.classList.add("shake");

    setTimeout(() => {
        gameScreen.classList.remove("shake");
    }, 300);
}

/**
 * Handles a tile click.
 * 
 * @param {Event} event - The click event of the tile
 */
function handleTileClick(event) {
    let clickedTileIndex = parseInt(event.target.dataset.index, 10);
    let clickedTile = event.target;

    if (tileFlash.includes(clickedTileIndex)) {
        tileFlash = tileFlash.filter(tile => tile !== clickedTileIndex);
        clickedTile.style.backgroundColor = player.color;
        clickedTile.removeEventListener("click", handleTileClick);
    
        if (tileFlash.length === 0) {
            level++
            if (level > levelConfig.length) {
                endGame(true);
            } else {
                setTimeout(startNewLevel, 500);
            }
        }
    } else {
        wrongPress();
        lives--;
        document.getElementById("lives").innerText = lives;

        if (lives === 0) {
            endGame(false);
        }
    }
}

/**
 * Ends the game when the player runs out of lives or completes all the levels.
 * 
 * @param {boolean} playerWon 
 */
function endGame(playerWon) {
    let gameOver = document.getElementById("gameOverMessage");
    let finalMessage = document.getElementById("finalMessage");
    let winMessage = document.getElementById("winMessage");

    showScreen("gameOverScreen");

    if (playerWon) {
        winMessage.innerHTML = "Congratulations!";
        gameOver.innerHTML = "You won!";
        finalMessage.innerHTML = "Great job!"
        
    } else {
        winMessage.innerHTML = "Game Over";
        gameOver.innerHTML = "You lost!";
        finalMessage.innerHTML = "Better luck next time!"
    }

    document.getElementById("levelReached").innerText = `Final Level: ${level}`;
    document.getElementById("livesLeft").innerText = `Lives Left: ${lives}`;
}

/**
 * Resets the game variables and returns the player to the intro screen.
 */
function restartGame() {
    lives = 3;
    level = 1;
    document.getElementById("lives").innerText = lives;

    showScreen("introScreen");
}