/****************************************************
 * COMPETITIVE MULTI-PLAYER MATCHING GAME
 * - Players enter how many people are playing
 * - Each player gets a timed turn
 * - Fastest player wins
 * - All messages appear inside the webpage
 ****************************************************/

// Grab HTML elements by their IDs
const board = document.getElementById("gameBoard");        // game board container
const messageBox = document.getElementById("messageBox");  // message display area
const playerSetup = document.getElementById("playerSetup");// player setup UI container
const playerCountInput = document.getElementById("playerCountInput"); // input for number of players
const startGameBtn = document.getElementById("startGameBtn");         // button to start game

// Game state variables
let totalPlayers = 0;      // total number of players
let playerTimes = [];      // array to store each player's time
let currentPlayer = 0;     // index of current player (0-based)
let startTime = 0;         // timestamp when current player's turn started

// Card-related variables
let cards = [];            // array of card values (emojis)
let flippedCards = [];     // currently flipped cards (max 2)
let matched = 0;           // number of cards matched so far

/****************************************************
 * FUNCTION: showMessage(text)
 * Updates the message box with the given text.
 ****************************************************/
function showMessage(text) {
  messageBox.innerText = text;
}

/****************************************************
 * FUNCTION: initializeGame()
 * Called when "Start Game" button is clicked.
 * Validates player count and starts first player's turn.
 ****************************************************/
function initializeGame() {
  // Read value from input and convert to integer
  totalPlayers = parseInt(playerCountInput.value);

  // Validate input: must be at least 1 player
  if (!totalPlayers || totalPlayers < 1) {
    showMessage("Please enter a valid number of players (at least 1).");
    return;
  }

  // Hide the player setup UI once game starts
  playerSetup.style.display = "none";

  // Initialize player times array with zeros
  playerTimes = new Array(totalPlayers).fill(0);

  // Reset current player index
  currentPlayer = 0;

  // Start the first player's turn
  startPlayerTurn();
}

/****************************************************
 * FUNCTION: startPlayerTurn()
 * Sets up the board and starts the timer for current player.
 ****************************************************/
function startPlayerTurn() {
  // Show whose turn it is
  showMessage(`Player ${currentPlayer + 1}'s turn! Match all the cards as fast as you can.`);

  // Reset game state for this player
  flippedCards = [];
  matched = 0;

  // Define card values (each card appears twice)
  cards = ["Bb","Bb","C","C","D","D","Eb","Eb","F","F","G","G","A","A"];

  // Shuffle the cards randomly
  cards.sort(() => Math.random() - 0.5);

  // Clear the board and rebuild it
  board.innerHTML = "";
  createCards();

  // Start timer using high-precision performance.now()
  startTime = performance.now();
}

/****************************************************
 * FUNCTION: endPlayerTurn()
 * Stops timer, records player's time, and moves to next player or ends game.
 ****************************************************/
function endPlayerTurn() {
  // Get current time and compute elapsed seconds
  const endTime = performance.now();
  const totalTime = ((endTime - startTime) / 1000).toFixed(2); // convert ms to seconds

  // Store this player's time
  playerTimes[currentPlayer] = totalTime;

  // Show message with player's time
  showMessage(`Player ${currentPlayer + 1} finished in ${totalTime} seconds!`);

  // Move to next player
  currentPlayer++;

  // If all players have played, determine winner
  if (currentPlayer >= totalPlayers) {
    // Small delay so last player's time message is visible
    setTimeout(() => {
      declareWinner();
    }, 1500);
  } else {
    // Small delay, then start next player's turn
    setTimeout(() => {
      startPlayerTurn();
    }, 1500);
  }
}

/****************************************************
 * FUNCTION: declareWinner()
 * Finds the fastest player and displays winner message.
 ****************************************************/
function declareWinner() {
  let fastestTime = Infinity; // start with very large number
  let winnerIndex = 0;        // index of winning player

  // Loop through all player times to find the smallest
  for (let i = 0; i < playerTimes.length; i++) {
    if (playerTimes[i] < fastestTime) {
      fastestTime = playerTimes[i];
      winnerIndex = i;
    }
  }

  // Show winner message
  showMessage(`🏆 Player ${winnerIndex + 1} wins with ${fastestTime} seconds!`);
}

/****************************************************
 * FUNCTION: createCards()
 * Builds card elements based on the shuffled cards array.
 ****************************************************/
function createCards() {
  // Loop through each emoji in the cards array
  cards.forEach((emoji) => {
    // Create a new div for the card
    const card = document.createElement("div");
    card.classList.add("card");       // add CSS class for styling
    card.dataset.value = emoji;       // store emoji in a data attribute
    card.innerHTML = "";              // start with card face hidden

    // Add click event to flip the card
    card.addEventListener("click", () => flipCard(card));

    // Add card to the game board
    board.appendChild(card);
  });
}

/****************************************************
 * FUNCTION: flipCard(card)
 * Handles flipping a card and triggers match checking.
 ****************************************************/
function flipCard(card) {
  // If two cards are already flipped, or this card is already flipped, do nothing
  if (flippedCards.length === 2 || card.classList.contains("flipped")) return;

  // Mark card as flipped visually
  card.classList.add("flipped");

  // Reveal the emoji stored in dataset.value
  card.innerHTML = card.dataset.value;

  // Add this card to the flippedCards array
  flippedCards.push(card);

  // If two cards are flipped, check if they match
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

/****************************************************
 * FUNCTION: checkMatch()
 * Compares two flipped cards and handles match or mismatch.
 ****************************************************/
function checkMatch() {
  // Destructure the two flipped cards
  const [c1, c2] = flippedCards;

  // If the emojis match
  if (c1.dataset.value === c2.dataset.value) {
    // Increase matched count by 2 (two cards matched)
    matched += 2;

    // Clear flippedCards array for next pair
    flippedCards = [];

    // If all cards are matched, end this player's turn
    if (matched === cards.length) {
      endPlayerTurn();
    }
  } else {
    // If they don't match, flip them back after a short delay
    setTimeout(() => {
      // Remove flipped class
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");

      // Hide emojis again
      c1.innerHTML = "";
      c2.innerHTML = "";

      // Clear flippedCards array
      flippedCards = [];
    }, 800); // 0.8 second delay
  }
}

/****************************************************
 * EVENT: Start Game button click
 * Connects the button to initializeGame().
 ****************************************************/
startGameBtn.addEventListener("click", initializeGame);
