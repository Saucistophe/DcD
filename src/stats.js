let numberOfCards=[
  [0,0,1,1],
  [0,1,1,2],
  [1,1,2,2],
  [1,2,2,3]
];

function getCardDeck() {
  // Prepare card deck according to picking probs
  let cardDeck = [];
  for(let i =0; i < 4; i++){
    for(let j = 0; j < 4; j++){
      for(let n =0; n < numberOfCards[i][j]; n++){
        cardDeck.push({i:i,j:j});
      }
    }
  }

  let shuffledDeck = cardDeck.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
  return shuffledDeck;
}

function getRatioString(ratio, max = 10) {
  let ratioString = '';
  let x = 0.5;
  for(; x < ratio * 10; x++)
    ratioString += '*';
  for(; x < max; x++)
    ratioString += ' ';

  return ratioString;
}

// Consider all possible configs.
let enemyInitialHealth = 1, myInitialHealth = 3;

for(let defenseCard = 0 ; defenseCard < 4; defenseCard++){
  for(let attackCard = 0 ; attackCard < 4; attackCard++){

    // Test over a large number of tries.
    let victoryCount = 0, defeatCount = 0, numberOfTurns = 0, woundCount = 0;
    for(let testInstance = 0; testInstance <1000; testInstance++) {

      let deck = getCardDeck();
      let myHealth = myInitialHealth;
      let enemyHealth = enemyInitialHealth;
      while(myHealth > 0 && enemyHealth > 0) {

        numberOfTurns++;
        // Refresh the stack if needed, pick a card.
        if(deck.length <= 0)
          deck = getCardDeck();
        let currentCard = deck.pop();

        if(currentCard.i === attackCard)
          enemyHealth--;
        else if(currentCard.j !== defenseCard)
          myHealth--;
      }

      if(myHealth === 0)
        defeatCount++;
      else
      {
        woundCount += myInitialHealth - myHealth;
        victoryCount++;
      }

    }

    if(victoryCount === 0)
      woundCount = 0;
    else
      woundCount = woundCount/victoryCount;

    let ratio = victoryCount / (victoryCount + defeatCount);

    let message = `My health ${myInitialHealth},enemy health ${enemyInitialHealth} `;
    message += `A${attackCard} D${defenseCard} : Win ${getRatioString(ratio)} (${ratio.toFixed(2)}), `;
    message += `wounds ${getRatioString(woundCount/5)} (${(woundCount).toFixed(1)}), `;
    message += `turns ${(numberOfTurns / 1000).toFixed(1)}`;
    console.log(message);
  }
}
