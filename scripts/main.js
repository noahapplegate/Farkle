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

const timeLimit = 2500; //Animation time in ms
const interval = 50; //Animation cycle in ms

// get buttons for playing Farkle
const rollB = document.getElementById("roll-button");
const rollPrevB = document.getElementById("roll-prev-button");
const bankB = document.getElementById("bank-button");

//get text elements to change
const roundScore = document.getElementById("round-score");
const playText = document.getElementById("play-text");

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

//Hide all images and buttons in rows on webpage load
for (let i = 0; i < 6; i++) {
  row1Array[i].hidden = true;
  row1BArray[i].hidden = true;
  row2Array[i].hidden = true;
  row2BArray[i].hidden = true;
}

//create variables to track turn
let dicePlay = [1,2,3,4,5,6]; //Dice in play
let nDicePlay = 6;// number of dice in play
let diceRow1 = [0,0,0,0,0,0];
let nDiceRow1 = 0;
let diceRow2 = [0,0,0,0,0,0];
let nDiceRow2 = 0;
let prevDice = [0,0,0,0,0,0];

// Event listener and handler for clicking roll button
rollB.addEventListener('click', () => {
  dicePlay = rollDice(nDicePlay);
  let rollResults = checkScore(dicePlay);
  let rollResultsTitles = getAllTitles(rollResults);

  const farkleString = "Farkle! Your roll has no combinations!";
  const resultsString = "Your highest value combinations are: ";

  if (rollResults[0][1] == 0) {
    playText.textContent = resultsString;
    let finishAnimate = setTimeout(function() {
      playText.textContent = farkleString;
    },(timeLimit + interval));
  } else {
    playText.textContent = resultsString;
    let finishAnimate = setTimeout(function() {
      playText.textContent = resultsString + rollResultsTitles.join(", ");
    },(timeLimit + interval));
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

function playBClick(selectedB) {
  let value = dicePlay[selectedB];

  diceRow2[nDiceRow2] = value;
  diceRow2 = updateDiceRow2(diceRow2);

  dicePlay[selectedB] = 0;
  dicePlay = updateDicePlay(dicePlay);

  nDicePlay -= 1;
  nDiceRow2 += 1;
}

function row2BClick(selectedB) {
  let value = diceRow2[selectedB];

  dicePlay[nDicePlay] = value;
  dicePlay = updateDicePlay(dicePlay);

  diceRow2[selectedB] = 0;
  diceRow2 = updateDiceRow2(diceRow2);

  nDicePlay += 1;
  nDiceRow2 -= 1;
}

function updateDicePlay(d6Array) {
  newArray = d6Array.filter(value => value > 0); //remove zero values
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

function updateDiceRow2(d6Array) {
  newArray = d6Array.filter(value => value > 0); //remove zero values
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
  return newArray;
}

function getAllTitles(completeResults) {
  let nResults = completeResults.length;
  let allTitles = [];
  for (let i = 0; i < nResults; i++) {
    allTitles.push(completeResults[i][0]);
  }
  return allTitles;
}

function getTotalScore(completeResults) {
  let nResults = completeResults.length;
  let totalScore;
  for (let i = 0; i < nResults; i++) {
    totalScore += completeResults[i][1];
  }
  return totalScore;
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
