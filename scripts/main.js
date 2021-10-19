const MIN_PLAYERS = 1;
const MAX_PLAYERS = 3;

// Store score card and remove button DOM element names
const scoreCardNames = ['score-card1', 'score-card2', 'score-card3'];
const removeButtonNames = ['remove-button1', 'remove-button2', 'remove-button3'];

// Get references to score card DOM elements
// Only show score cards for min players to start
const displayedCards = [];
const hiddenCards = [];
for (let i = 0; i < MIN_PLAYERS; i++) {
    displayedCards.push(document.getElementById(scoreCardNames[i]));
}
for (let i = MAX_PLAYERS-1; i >= MIN_PLAYERS; i--) {
    let hiddenCard = document.getElementById(scoreCardNames[i]);
    hiddenCard.hidden = true;
    hiddenCards.push(hiddenCard);
}

// Get references to remove button DOM elements
const removeButtons = []
removeButtonNames.forEach((buttonName) => {
    removeButtons.push(document.getElementById(buttonName));
})

// Get add button DOM element
let addButton = document.getElementById('add-button');
let addCard = document.getElementById('add-card');

// Event listener and handler for adding new players
// Gets the last hidden card and displays it
addButton.addEventListener('click', () => {
    // Only add cards up to the max number of players
    if (displayedCards.length < MAX_PLAYERS) {
        let newCard = hiddenCards.pop();
        newCard.hidden = false;
        displayedCards.push(newCard);

        if (displayedCards.length == MAX_PLAYERS) {
            addCard.hidden = true;
        }
    }
});

// Add Event listeners and handlers for closing
const removeScoreCard = (event) => {
    if (displayedCards.length > MIN_PLAYERS) {
        let scoreCard = event.currentTarget.parentNode;
        const index = displayedCards.indexOf(scoreCard);
        if (index > -1) {
            if (displayedCards.length == MAX_PLAYERS) {
                addCard.hidden = false;
            }

            displayedCards.splice(index, 1);
            scoreCard.hidden = true;
            hiddenCards.push(scoreCard);
        }
    }
}
removeButtons.forEach((removeButton) => {
    removeButton.addEventListener('click', removeScoreCard);
})

// Get dice elements in play area and store in array
const diceArray = [document.getElementById("die1"),
document.getElementById("die2"),
document.getElementById("die3"),
document.getElementById("die4"),
document.getElementById("die5"),
document.getElementById("die6")];

//set a function that is makes a delay
//let rollInterval;

function rollDice(nDice) {
  for (let i = 0; i < 6; i++) {
    if (i < nDice) {
      diceArray.hidden = false;
    } else {
      diceArray.hidden = true;
    }
  }
  let rd6 = [0,0,0,0,0,0]; //set up array of null values
  startTime = Date.now();
  endTime = startTime + 5000;
  while (Date.now() < endTime) {
    for (let ii = 0; ii < nDice; ii++) {
      rd6[ii] = Math.floor(Math.random()*6 + 1); //pick a random number between 1 and 6
      diceArray[ii].src = "images/dice-" + rd6[ii] + "-640px.png";
    }
  }

  return rd6;
}
