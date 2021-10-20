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

// get buttons for playing Farkle
const rollB = document.getElementById("roll-button")
const rollPrevB = document.getElementById("roll-prev-button")
const bankB = document.getElementById("bank-button")

// Event listener and handler for clicking roll button
rollB.addEventListener('click', () => {
    
});

// Get dice elements in play area and store in array
const diceArray = [document.getElementById("die1"),
document.getElementById("die2"),
document.getElementById("die3"),
document.getElementById("die4"),
document.getElementById("die5"),
document.getElementById("die6")];

function rollDice(nDice = 6) {
  /*
  This function takes the number of dice to be rolled as input and then
  picks the values at random and then animates the roll table before
  displaying the final result. This function returns an array of the values
  in order.
  This function needs access to global array "diceArray"
  */
  if (!(nDice <= 6 || nDice < 1)) {
    console.log("ERROR: That is not a valid input");
    return [0,0,0,0,0,0];
  }

  let timeLimit = 2500; //Animation time in ms
  let interval = 50; //Animation cycle in ms

  for (let i = 0; i < 6; i++) {
    if (i < nDice) {
      diceArray[i].hidden = false;
    } else {
      diceArray[i].hidden = true;
    }
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

  //After animation is done, display the final values
  let finishAnimate = setTimeout(function() {
    for (let i = 0; i < nDice; i++) {
      diceArray[i].src = "images/dice-" + rd6[i] + "-640px.png";
    }
  },(timeLimit + interval));

  return rd6;
}
