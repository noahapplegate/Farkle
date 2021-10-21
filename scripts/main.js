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

// Get dice elements in play area and store in array
const diceArray = [document.getElementById("die1"),
document.getElementById("die2"),
document.getElementById("die3"),
document.getElementById("die4"),
document.getElementById("die5"),
document.getElementById("die6")];

const diceBArray = [document.getElementById("play-b-1"),
document.getElementById("play-b-2"),
document.getElementById("play-b-3"),
document.getElementById("play-b-4"),
document.getElementById("play-b-5"),
document.getElementById("play-b-6")];

// Event listener and handler for clicking roll button
rollB.addEventListener('click', () => {
  console.log(checkScore(rollDice()));
});

const scoreTable = {
  farkle: ["farkle", 0],
  one: ["1", 100], //0
  five: ["5", 50], //1
  three1s: ["three 1s", 1000],
  three2s: ["three 2s", 200],
  three3s: ["three 3s", 300],
  three4s: ["three 4s", 400],
  three5s: ["three 5s", 500],
  three6s: ["three 6s", 600],
  fourKind: ["four of a kind", 1000],
  fiveKind: ["five of a kind", 2000],
  sixKind: ["six of a kind", 3000],
  straight: ["straight", 1500],
  threePairs: ["three pairs", 1500],
  fourKindPair: ["four of kind + pair", 1500],
  twoTriplets: ["two triplets", 2500]
};

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
