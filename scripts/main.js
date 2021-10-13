const MIN_PLAYERS = 1;
const MAX_PLAYERS = 3;

// Store score card element names
const scoreCardNames = ['score-card1', 'score-card2', 'score-card3'];

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