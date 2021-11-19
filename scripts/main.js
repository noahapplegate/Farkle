const MIN_PLAYERS = 2;
const MAX_PLAYERS = 6;
const WINNING_THRESHOLD = 100;  // Number of points required to win the game
let FINAL_ROUND = false;
let first_player_to_threshold = null;


// *****************************************************************************
//                          CREATE SCORE CARDS
//
//  Scorecards will store the player's name, their current score, and a button
//  to remove this player from the game.
//
//  Note: We use input.user-score-num to hold the numerical score value and
//        span.user-score to render the value to the screen.
// *****************************************************************************
const inactiveScoreCards = [];
const scoreCardContainer = document.querySelector("div.score-card-container");

for (let i = 0; i < MAX_PLAYERS; ++i) {
    // Create a new Element for this score card
    let scoreCard = document.createElement("div");
    scoreCard.classList.add("box");
    scoreCard.classList.add("score-card");    
    scoreCard.innerHTML = `
        <input type="text" class="name" maxlength="20" placeholder="Enter Player Name">
        <div>
          <span>Score:</span>
          <span class="user-score">0</span>
        </div>
        <input type="number" class="user-score-num">
        <button class="removeButton">Remove Player</button>
    `;
    score = scoreCard.querySelector(".user-score-num");
    score.value = 0;
    score.hidden = true;

    // Add an event listener to the remove button
    const scoreCardRemoveButton = scoreCard.querySelector("button.removeButton");
    scoreCardRemoveButton.addEventListener("click", () => {
        // Only remove cards if we have more than the min number of players and it is not the final round
        if (inactiveScoreCards.length < MAX_PLAYERS - MIN_PLAYERS && !FINAL_ROUND) {
            if (inactiveScoreCards.length == 0) {
              addButtonContainer.style.display = "flex";
            }

            // If we are removing the currently plaing card, set the currently playing card to the next card
            if (scoreCard === currentlyPlaying) {
                changeTurn();
            }

            // Reset the player's name and score
            scoreCard.querySelector("input").value = "";
            scoreCard.querySelector("span.user-score").innerText = 0;
            scoreCard.querySelector(".user-score-num").value = 0;

            // Remove the Element from the DOM and add it list of unused scoreCards
            inactiveScoreCards.push(scoreCardContainer.removeChild(scoreCard));
        }
    });

    // Start with the minimum number of players initially
    if (i < MIN_PLAYERS) {
        scoreCardContainer.append(scoreCard);
    }
    else {
        inactiveScoreCards.push(scoreCard);
    }
}
// *****************************************************************************
//                       END - CREATE SCORE CARDS
// *****************************************************************************

// Create event listener for add button to add new players
const addButton = document.querySelector(".add-button");
const addButtonContainer = document.querySelector("#add-card");
addButton.addEventListener("click", () => {
    // Add an inactive card to the DOM if one exists and it is not the final round
    if (inactiveScoreCards.length > 0 && !FINAL_ROUND) {
      if (inactiveScoreCards.length == 1) {
        addButtonContainer.style.display = "none";
      }

      scoreCardContainer.append(inactiveScoreCards.pop());
    }
});

// Start the game with the first score card having the first turn
let currentlyPlaying = scoreCardContainer.firstElementChild;
currentlyPlaying.classList.add("currently-playing");


// Function: changeTurn
// ---------------------
// Changes the score card that is currently playing to
// the next one in the scoreCardContainer.
// Returns a flag to signal if the game should be over or not
const changeTurn = () => {
    let endGame = false;

    // Get the element who will be playing next turn
    let nextPlayer = currentlyPlaying.nextElementSibling;
    nextPlayer = nextPlayer != null ? nextPlayer : scoreCardContainer.firstElementChild;

    // Update the currently playing class to be active on the next element
    currentlyPlaying.classList.remove("currently-playing");
    nextPlayer.classList.add("currently-playing");

    currentlyPlaying = nextPlayer;

    // If we have completed the final round, end the game
    if (FINAL_ROUND && nextPlayer == first_player_to_threshold) {
      endGame = true;
    }

    return endGame;
};

// Function: gameOver
// ---------------------
// Ends the game by displaying a pop-up window with final scores in descending order.
// A reset button is displayed that can be used to reset the scores.
const gameOver = () => {
  // Get an array containing each score card's name and score in an object
  let finalScoreCards = scoreCardContainer.children;
  let finalCardsInfo = [];
  for (let i = 0; i < finalScoreCards.length; ++i) {
    let cardName = finalScoreCards[i].querySelector(".name").value;
    let cardScore = finalScoreCards[i].querySelector(".user-score-num").valueAsNumber;

    finalCardsInfo.push({
      name: cardName,
      score: cardScore
    });
  }

  // Sort card info by final scores descending
  finalCardsInfo.sort((a, b) => (a.score > b.score) ? -1 : 1);

  // Add divs to the pop-up window containing each player's name and final scores
  let finalScoreContainer = document.querySelector("#final-scores");
  for (let i = 0; i < finalCardsInfo.length; ++i) {
    let finalScoreCard = document.createElement("div");
    finalScoreCard.classList.add("final-score");

    finalScoreCard.innerHTML = `
        ${i+1}. ${finalCardsInfo[i].name} - ${finalCardsInfo[i].score}
    `;

    finalScoreContainer.appendChild(finalScoreCard);
  }

  // Add event listener to the restart button
  document.querySelector("#restart").addEventListener('click', () => {
    resetGame(finalScoreCards, finalScoreContainer);
  });

  // Disable buttons
  rollB.disabled = true;
  rollPrevB.disabled = true;
  bankB.disabled = true;

  // Display game over window
  document.querySelector(".main-page").style.opacity = "0.5";
  document.querySelector("#game-over").style.display = "block";
};

// Function: updateScore
// ---------------------
// params: pointsScored - An integer containing the points scored by the player this round.
//
// Adds the points scored during the round to the current player's total.
const updateScore = (pointsScored) => {
  // Add to the current player's score
  let newScore = currentlyPlaying.querySelector(".user-score-num").valueAsNumber + pointsScored;
  currentlyPlaying.querySelector(".user-score-num").valueAsNumber = newScore;

  // Render the player's new score
  currentlyPlaying.querySelector(".user-score").innerText = newScore;

  // If this player is the first to reach the winning threshold, we initiate the final round
  if (newScore >= WINNING_THRESHOLD && first_player_to_threshold == null) {
    initFinalRound(currentlyPlaying);
  }
};

// Function: initFinalRound
// ---------------------
// params: currentlyPlaying - A reference to the HTML Element of the currently playing score card
//
// Marks the current player as first player to reach the winning threshold. Once we return to this player
// again, the game is over. We set the final round flag to true to signal we are in the last round.
const initFinalRound = (currentlyPlaying) => {
  first_player_to_threshold = currentlyPlaying;
  FINAL_ROUND = true;
  first_player_to_threshold.classList.add("first-player-to-threshold");
  let finalRoundNote = document.createElement("div");
  finalRoundNote.innerHTML = `${first_player_to_threshold.querySelector(".name").value} has reached the objective score!<br>
                              This is the final round!`;
  document.querySelector("div.play-area").prepend(finalRoundNote);
};

// Function: resetGame
// ---------------------
// params: finalScoreCards - references to the score cards in play when the game ended
//
// Resets the game to its initial state.
const resetGame = (finalScoreCards, finalScoreCardContainer) => {
  // Reset scores to 0
  for (let i = 0; i < finalScoreCards.length; ++i) {
    finalScoreCards[i].querySelector("span.user-score").innerText = 0;
    finalScoreCards[i].querySelector(".user-score-num").value = 0;
  }

  // Set the first scorecard to the one currently playing
  let firstPlayer = finalScoreCards[0];
  currentlyPlaying.classList.remove("currently-playing");
  firstPlayer.classList.add("currently-playing");
  currentlyPlaying = firstPlayer;

  // Reset final round info
  FINAL_ROUND = false;
  first_player_to_threshold.classList.remove("first-player-to-threshold");
  first_player_to_threshold = null;
  let finalRoundNote = document.querySelector("div.play-area");
  finalRoundNote.removeChild(finalRoundNote.firstChild);

  // Reset the play area
  initPlayArea();

  // Stop displaying the game over pop-up window
  document.querySelector(".main-page").style.opacity = "1";
  document.querySelector("#game-over").style.display = "none";

  // Remove final scores
  while (finalScoreCardContainer.firstElementChild) {
    finalScoreCardContainer.removeChild(finalScoreCardContainer.firstElementChild);
  }
};

const timeLimit = 2500; //Animation time in ms
const interval = 50; //Animation cycle in ms

// get buttons for playing Farkle
const rollB = document.getElementById("roll-button");
const rollPrevB = document.getElementById("roll-prev-button");
const bankB = document.getElementById("bank-button");

//get text elements to change
const roundScore = document.getElementById("round-score");
const playText = document.getElementById("play-text");
const notifications = document.getElementById("notifications");
const row2Score = document.getElementById("row2-score");

// Get dice elements in play area and store in array
const diceArray = [document.getElementById("die1"),
  document.getElementById("die2"),
  document.getElementById("die3"),
  document.getElementById("die4"),
  document.getElementById("die5"),
  document.getElementById("die6")];

//B stands for button
const diceBArray = [document.getElementById("play-b-1"),
  document.getElementById("play-b-2"),
  document.getElementById("play-b-3"),
  document.getElementById("play-b-4"),
  document.getElementById("play-b-5"),
  document.getElementById("play-b-6")];

//get dice elements in rows in the panel/sidebar
const row1Array = [document.getElementById("row1-img-1"),
  document.getElementById("row1-img-2"),
  document.getElementById("row1-img-3"),
  document.getElementById("row1-img-4"),
  document.getElementById("row1-img-5"),
  document.getElementById("row1-img-6")];

const row1BArray = [document.getElementById("row1-b-1"),
  document.getElementById("row1-b-2"),
  document.getElementById("row1-b-3"),
  document.getElementById("row1-b-4"),
  document.getElementById("row1-b-5"),
  document.getElementById("row1-b-6")];

const row2Array = [document.getElementById("row2-img-1"),
  document.getElementById("row2-img-2"),
  document.getElementById("row2-img-3"),
  document.getElementById("row2-img-4"),
  document.getElementById("row2-img-5"),
  document.getElementById("row2-img-6")];

const row2BArray = [document.getElementById("row2-b-1"),
  document.getElementById("row2-b-2"),
  document.getElementById("row2-b-3"),
  document.getElementById("row2-b-4"),
  document.getElementById("row2-b-5"),
  document.getElementById("row2-b-6")];

//create variables to track turn
let dicePlay = [1,2,3,4,5,6]; //Dice in play
let nDicePlay = 6;// number of dice in play
let diceRow1 = [0,0,0,0,0,0];
let nDiceRow1 = 0;
let diceRow2 = [0,0,0,0,0,0];
let nDiceRow2 = 0;
let prevDice = [0,0,0,0,0,0];
let originalRoll = [1,2,3,4,5,6]; //original roll for reference purposes does not represent what is in play area, but what was originally rolled.
let turnScore = 0;
let startOfTurn = true; //this boolean tracks if this is the first roll of the turn or not.

// Function: resetPlayAreaVariables
// ---------------------
// Sets play area variables back to their initial states
const resetPlayAreaVariables = () => {
  dicePlay = [1,2,3,4,5,6];
  nDicePlay = 6;
  diceRow1 = [0,0,0,0,0,0];
  nDiceRow1 = 0;
  diceRow2 = [0,0,0,0,0,0];
  nDiceRow2 = 0;
  prevDice = [0,0,0,0,0,0];
  originalRoll = [1,2,3,4,5,6];
  turnScore = 0;
};

// Function: initPlayArea
// ---------------------
// Sets up the play area to its initial state before players begin rolling.
const initPlayArea = () => {
  //Hide all images and buttons in rows on webpage load
  for (let i = 0; i < 6; i++) {
    row1Array[i].hidden = true;
    row1BArray[i].hidden = true;
    row2Array[i].hidden = true;
    row2BArray[i].hidden = true;
  }

  rollPrevB.disabled = true; //disable roll prev. button at start of game

  resetPlayAreaVariables();

  startOfTurn = true;

  playText.textContent = "Click the roll button to start!";
  alert();
  roundScore.textContent = "Previous score: 0";
  row2Score.textContent = "0";

  // Set up buttons
  rollB.disabled = false;
  rollPrevB.disabled = true;
  bankB.disabled = false;

  diceBArray.forEach(element => element.hidden = false);
  diceArray.forEach(element => element.hidden = false);
};

initPlayArea();

// Event listener and handler for clicking roll button
rollB.addEventListener('click', () => {
  alert(); //reset notifications

  if (startOfTurn) {
    startOfTurn = false;
    resetPlayAreaVariables();
    updateDicePlay(dicePlay);
    updateDiceRow1(diceRow1);
    updateDiceRow2(diceRow2);
  } else if (nDiceRow2 == 0) {
    alert("You must set aside at least one die to continue rolling");
    return;
  }

  //if player set aside dice that doesn't make a valid combination then stop function
  for (let i = 0; i < nDiceRow2; i++) {
    if (!isValid(diceRow2, diceRow2[i])) {
      alert("One or more of your dice set aside doesn't make an allowed combination");
      return;
    }
  }

  initiateDiceRolling();
});

rollPrevB.addEventListener('click', () => {
  startOfTurn = false;
  alert(); //reset notifications

  rollPrevB.disabled = true;
  //rollPrevB.style.color = '#bd5a4a';

  initiateDiceRolling();
});

bankB.addEventListener('click', () => {
  if (nDiceRow2 == 0) {
    alert("You must set aside at least one die to bank your score");
    return;
  }

  //if player set aside dice that doesn't make a valid combination then stop function
  for (let i = 0; i < nDiceRow2; i++) {
    if (!isValid(diceRow2, diceRow2[i])) {
      alert("One or more of your dice set aside doesn't make an allowed combination");
      return;
    }
  }

  turnScore += getTotalScore(checkScore(diceRow2));

  //==========================================================================
  //Code that adds turnScore to current player and then changes to next player
  //==========================================================================
  updateScore(turnScore);

  let endGame = changeTurn();

  alert("Click [Roll] to start fresh or click [Roll prev.] to roll with remaining dice and previous player's score");

  rollPrevB.disabled = false;

  startOfTurn = true;

  prevDice = clone(dicePlay);

  diceRow1 = [0,0,0,0,0,0];
  nDiceRow1 = 0;
  diceRow2 = [0,0,0,0,0,0];
  nDiceRow2 = 0;
  updateDiceRow1(diceRow1);
  updateDiceRow2(diceRow2);

  roundScore.textContent = "Previous score: " + turnScore;

  if (endGame) {
    gameOver();
  }
});

diceBArray[0].addEventListener('click', () => {playBClick(0);});
diceBArray[1].addEventListener('click', () => {playBClick(1);});
diceBArray[2].addEventListener('click', () => {playBClick(2);});
diceBArray[3].addEventListener('click', () => {playBClick(3);});
diceBArray[4].addEventListener('click', () => {playBClick(4);});
diceBArray[5].addEventListener('click', () => {playBClick(5);});

row2BArray[0].addEventListener('click', () => {row2BClick(0);});
row2BArray[1].addEventListener('click', () => {row2BClick(1);});
row2BArray[2].addEventListener('click', () => {row2BClick(2);});
row2BArray[3].addEventListener('click', () => {row2BClick(3);});
row2BArray[4].addEventListener('click', () => {row2BClick(4);});
row2BArray[5].addEventListener('click', () => {row2BClick(5);});

const scoreTable = {
  /*Title, score*/
  farkle: ["farkle", 0],
  one: ["1", 100],
  five: ["5", 50],
  three1s: ["1-1-1", 1000],
  three2s: ["2-2-2", 200],
  three3s: ["3-3-3", 300],
  three4s: ["4-4-4", 400],
  three5s: ["5-5-5", 500],
  three6s: ["6-6-6", 600],
  fourKind: ["Four-of-a-kind", 1000],
  fiveKind: ["Five-of-a-kind", 2000],
  sixKind: ["Six-of-a-kind", 3000],
  straight: ["Straight", 1500],
  threePairs: ["Three pairs", 1500],
  fourKindPair: ["Four-of-a-kind + pair", 1500],
  twoTriplets: ["Two triplets", 2500]
};

function initiateDiceRolling() {
  /*
  This function uses many global variables and is essentially the code that is
  run when rollB and rollPrevB buttons are clicked. It handles both the
  displaying of the combinations and certain notifications depending on the
  situation. It also calls rollDice function which is the function that actually
  animates the dice and then this function takes those results.
  */

  rollB.disabled = true; //temporarily disable button while animation plays
  bankB.disabled = true;

  //Handle hot dice case
  if (nDicePlay == 0) {
    turnScore += getTotalScore(checkScore(diceRow2));

    nDicePlay = 6;
    diceRow1 = [0,0,0,0,0,0];
    nDiceRow1 = 0;
    diceRow2 = [0,0,0,0,0,0];
    nDiceRow2 = 0;

    updateDiceRow1(diceRow1);
    updateDiceRow2(diceRow2);
  }

  dicePlay = rollDice(nDicePlay);
  originalRoll = clone(dicePlay);
  let rollResults = checkScore(dicePlay);
  let rollResultsTitles = getAllTitles(rollResults);

  //this if statement handles transfering dice to row1 and updating turnScore
  if (nDiceRow2 > 0) {
    //Add values in diceRow2 to diceRow1
    for (let i = nDiceRow1; i < nDiceRow1 + nDiceRow2; i++) {
      diceRow1[i] = diceRow2[i - nDiceRow1];
    }

    turnScore += getTotalScore(checkScore(diceRow2));

    diceRow1 = updateDiceRow1(diceRow1);
    diceRow2 = updateDiceRow2([0,0,0,0,0,0]);

    nDiceRow1 += nDiceRow2;
    nDiceRow2 = 0;
  }

  const farkleString = "Farkle! Your roll has no combinations!";
  const resultsString = "Your highest value combinations are: ";

  if (rollResults[0][1] == 0) {
    playText.textContent = resultsString;

    startOfTurn = true;

    let finishAnimate = setTimeout(function() {
      rollB.disabled = false; //reactivate button after animation
      bankB.disabled = false;
      //=================================
      //Code that changes to next player
      //=================================
      let endGame = changeTurn();
      playText.textContent = farkleString;
      if (endGame) {
        gameOver();
      }
    },(timeLimit + interval));
  } else {
    playText.textContent = resultsString;
    let finishAnimate = setTimeout(function() {
      rollB.disabled = false; //reactivate button after animation
      bankB.disabled = false;
      playText.textContent = resultsString + rollResultsTitles.join(", ");

      for (let i = 0; i < nDicePlay; i++) {
        if (!isValid(dicePlay, dicePlay[i])) {
          break; //exit loop early if one of the values is not valid
        } else if (i+1 == nDicePlay) {
          //Show this message if all dice are allowed to be scored.
          alert("Hot dice! You may continue rolling after you set aside the remaining dice.");
          bankB.disabled = true;
        }
      }
    },(timeLimit + interval));
  }
}

function playBClick(selectedB) {
  /*
  this function occurs when a dice in the play area is clicked. If valid it
  transfers the dice to row2
  */
  let value = dicePlay[selectedB];

  if (startOfTurn == true) {
    alert("You haven't rolled yet!");
    return;
  }

  if (!isValid(originalRoll, value)) {
    alert("That is not part of a combination!");
    return;
  } else {
    alert(); //reset notifications
  }

  diceRow2[nDiceRow2] = value;
  diceRow2 = updateDiceRow2(diceRow2);

  dicePlay[selectedB] = 0;
  dicePlay = updateDicePlay(dicePlay);

  nDicePlay -= 1;
  nDiceRow2 += 1;

  if (nDicePlay == 0) {
    alert("Hot dice! Click the roll button to continue rolling with six dice and build on your current score!");
  }
}

function row2BClick(selectedB) {
  /*
  this function occurs when a dice in the row2 area is clicked. If valid it
  transfers the dice to row2
  */
  let value = diceRow2[selectedB];

  dicePlay[nDicePlay] = value;
  dicePlay = updateDicePlay(dicePlay);

  diceRow2[selectedB] = 0;
  diceRow2 = updateDiceRow2(diceRow2);

  nDicePlay += 1;
  nDiceRow2 -= 1;
}

function updateDicePlay(d6Array) {
  /*
  this function is used when the images for the dice in the play area need to
  be updated with a new array of dice values. Often used when a dice is clicked.
  Needs acces to global variables diceArray and diceBArray.
  */
  let newArray = d6Array.filter(value => value > 0); //remove zero values
  for (let i = 0; i < 6; i++) {
    if (!newArray[i]) {
      newArray.push(0) //append 0's if they were removed
      diceArray[i].hidden = true;
      diceBArray[i].hidden = true;
      continue;
    }
    diceArray[i].src = "images/dice-" + newArray[i] + "-640px.png";
    diceArray[i].hidden = false;
    diceBArray[i].hidden = false;
  }
  return newArray;
}

function updateDiceRow1(d6Array) {
  /*
  this function is used when the images for the dice in the row2 area need to
  be updated with a new array of dice values. Often used when a dice is clicked.
  It also changes the display score.
  Needs acces to global variables row1Array, row1BArray, and roundScore.
  */
  let newArray = d6Array.filter(value => value > 0); //remove zero values
  for (let i = 0; i < 6; i++) {
    if (!newArray[i]) {
      newArray.push(0) //append 0's if they were removed
      row1Array[i].hidden = true;
      row1BArray[i].hidden = true;
      continue;
    }
    row1Array[i].src = "images/dice-" + newArray[i] + "-640px.png";
    row1Array[i].hidden = false;
    row1BArray[i].hidden = false;
  }

  roundScore.textContent = "score if banked: " + turnScore;

  return newArray;
}

function updateDiceRow2(d6Array) {
  /*
  this function is used when the images for the dice in the row2 area need to
  be updated with a new array of dice values. Often used when a dice is clicked
  Needs acces to global variables row2Array and row2BArray.
  */
  let newArray = d6Array.filter(value => value > 0); //remove zero values
  for (let i = 0; i < 6; i++) {
    if (!newArray[i]) {
      newArray.push(0) //append 0's if they were removed
      row2Array[i].hidden = true;
      row2BArray[i].hidden = true;
      continue;
    }
    row2Array[i].src = "images/dice-" + newArray[i] + "-640px.png";
    row2Array[i].hidden = false;
    row2BArray[i].hidden = false;
  }

    row2Score.textContent = getTotalScore(checkScore(newArray));
    roundScore.textContent = "score if banked: " + (turnScore + getTotalScore(checkScore(newArray)));
  return newArray;
}

function getAllTitles(completeResults) {
  //This function helps inteperet results from the checkScore function and
  //gets all the titles from the results given
  let nResults = completeResults.length;
  let allTitles = [];
  for (let i = 0; i < nResults; i++) {
    allTitles.push(completeResults[i][0]);
  }
  return allTitles;
}

function getTotalScore(completeResults) {
  //This function helps inteperet results from the checkScore function and
  //gets the sum of the scores from the results given
  let nResults = completeResults.length;
  let totalScore = 0;
  for (let i = 0; i < nResults; i++) {
    totalScore += completeResults[i][1];
  }
  return totalScore;
}

function isValid(d6Array,value) {
  /*
  This function takes an array and a value and checks if that
  value is allowed for scoring purposes based on the array given.
  For example, if the array is [1,2,3,3,3,6] then values 2 and 6 will return
  false since they are not part of a combination that gives a score.
  Returns a boolean
  */
  let results = checkScore(d6Array);

  //if the player farkled than no values are allowed
  if (results[0][0] == "farkle") {
    return false;
  }

  //if value is 1 or 5 then that is always allowed
  if (value == "1" || value == "5") {
    return true;
  }

  //if results are a combination that uses all 6 dice then the value must be used
  if (results[0][0] == "Six-of-a-kind" || results[0][0] == "Straight" || results[0][0] == "Three pairs" || results[0][0] == "Four-of-a-kind + pair" || results[0][0] == "Two triplets") {
    return true;
  }

  //if there are 3 or more of the value in the array then it is always valid
  if (d6Array.filter(number => number == value).length >= 3) {
    return true;
  }

  //If all the above are not true then return false
  return false;
}

function checkScore(d6Array) {
  /*
  This function takes in an array of 6 numbers and assigns the results
  variable with pairs of combination names and scores depending on the
  numbers in the given arrays.
  This function needs access to global object "scoreTable"
  */
  let results = [];

  let nOne = d6Array.filter(number => number == 1).length;
  let nTwo = d6Array.filter(number => number == 2).length;
  let nThree = d6Array.filter(number => number == 3).length;
  let nFour = d6Array.filter(number => number == 4).length;
  let nFive = d6Array.filter(number => number == 5).length;
  let nSix = d6Array.filter(number => number == 6).length;

  let nArray = [nOne, nTwo, nThree, nFour, nFive, nSix];

  /*THE BELOW IF STATEMENTS descend in priority. This structure assumes
  that higher value combinations got caught above and returned*/

  //check for straight by seeing if each number appears once
  if (nArray.every(number => number == 1)) {
    results.push(scoreTable.straight);
    return results; //return since there are no better melds
  }
  //check for six of a kind by seeing if any length equals 6
  if (nArray.some(number => number == 6)) {
    results.push(scoreTable.sixKind);
    return results;
  }
  //check for two triplets
  if (nArray.filter(number => number == 3).length == 2) {
    results.push(scoreTable.twoTriplets);
    return results;
  }
  //check for three pairs
  if (nArray.filter(number => number == 2).length == 3) {
    results.push(scoreTable.threePairs);
    return results;
  }
  //check for five of a kind and extra 1 or 5
  if (nArray.some(number => number == 5)) {
    results.push(scoreTable.fiveKind);
    if (nOne == 1) {
      results.push(scoreTable.one);
    }
    if (nFive == 1) {
      results.push(scoreTable.five);
    }
    return results;
  }
  //check for four of a kind and four of a kind + pair
  if (nArray.some(number => number == 4)) {
    //check for also having a pair
    if (nArray.some(number => number == 2)) {
      results.push(scoreTable.fourKindPair)
      return results;
    }

    if (nOne == 4) {
      //if four 1s matching 1-1-1 and 1 is better than four of a kind
      results.push(scoreTable.three1s);
      results.push(scoreTable.one);
    } else {
      results.push(scoreTable.fourKind);
    }
    //check for stray 1 or 5
    if (nOne == 1) {
      results.push(scoreTable.one);
    }
    if (nFive == 1) {
      results.push(scoreTable.five);
    }
    return results;
  }
  //check for remaining combinations
  for (let i = 0; i < 6; i++) {
    if (nArray[i] == 3) {
      switch (i + 1) {
        case 1:
          results.push(scoreTable.three1s);
          nOne = nOne - 3;
          break;
        case 2:
          results.push(scoreTable.three2s);
          break;
        case 3:
          results.push(scoreTable.three3s);
          break;
        case 4:
          results.push(scoreTable.three4s);
          break;
        case 5:
          results.push(scoreTable.three5s);
          nFive = nFive - 3;
          break;
        case 6:
          results.push(scoreTable.three6s);
          break;
      }
    }
  }
  //add 1s or 5s depending on how many there are (there shouldn't be more than 2)
  for (let i = 0; i < nOne; i++) {
    results.push(scoreTable.one);
  }
  for (let i = 0; i < nFive; i++) {
    results.push(scoreTable.five);
  }
  //if no other results have been pushed then you farkled!
  if (results.length == 0) {
    results.push(scoreTable.farkle);
  }
  return results;
}

function rollDice(nDice = 6) {
  /*
  This function takes the number of dice to be rolled as input and then
  picks the values at random and then animates the roll table before
  displaying the final result. This function returns an array of the values
  in order. It also temporarily hides the buttons and then reveals them
  after the animation is done
  This function needs access to global arrays "diceArray" and "diceBArray"
  and constants timeLimit and interval
  */
  if (!(nDice <= 6 || nDice < 1)) {
    console.log("ERROR: That is not a valid input");
    return [0,0,0,0,0,0];
  }

  for (let i = 0; i < 6; i++) {
    if (i < nDice) {
      diceArray[i].hidden = false;
    } else {
      diceArray[i].hidden = true;
    }

    diceBArray[i].hidden = true; //Temporarily hide all buttons in play area
  }
  let rd6 = [0,0,0,0,0,0]; //set up array of null values
  //Then find final values
  for (let i = 0; i < nDice; i++) {
    rd6[i] = Math.floor(Math.random()*6 + 1); //pick a random number between 1 and 6
  }

  //Animate rolls for a certain amount of time
  endTime = Date.now() + timeLimit;
  let animation = setInterval(function() {
    let rd6Animate = [0,0,0,0,0,0];
    for (let i = 0; i < nDice; i++) {
      rd6Animate[i] = Math.floor(Math.random()*6 + 1); //pick a random number between 1 and 6
      diceArray[i].src = "images/dice-" + rd6Animate[i] + "-640px.png";
    }

    if (Date.now() > endTime) {
      clearInterval(animation);
    }
  },50);

  //After animation is done, display the final values and reveal buttons
  let finishAnimate = setTimeout(function() {
    for (let i = 0; i < nDice; i++) {
      diceArray[i].src = "images/dice-" + rd6[i] + "-640px.png";
      diceBArray[i].hidden = false; //reveal play buttons.
    }
  },(timeLimit + interval));

  return rd6;
}

function alert(content = null) {
  /*
  content = text content that you want to alert the player, leave empty if you want to turn alert off
  needs access to notifications DOM constant.
  This function simply changes the notifications paragraph in the play area and
  updates the CSS accordingly.
  If you use this function make sure to reset it
  */
  if (content == null) {
    notifications.textContent = " ";
    notifications.classList.remove("alert");
  } else {
    notifications.textContent = content;
    notifications.classList.add("alert");
  }
}

function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}
