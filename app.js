//----------------------------------------------------------------------------------------------------------//
/*
                                                    GAME RULES:

- The game has 2 players, playing in rounds.

- In each turn, a player rolls a dice as many times as they whish. 
  Each result get added to his ROUND score.
  
- BUT, if the player rolls a 1, all their ROUND score gets lost. After that, it's the next player's turn.

- The player can choose to 'Hold', which means that their ROUND score gets added to their GLOBAL score. 
  After that, it's the next player's turn.
  
- The first player to reach 50 points on GLOBAL score wins the game.
*/
//----------------------------------------------------------------------------------------------------------//

//== FIELDS ==
var scores, roundScore, activePlayer, gamePlaying,
    settingsModal, player0Name, player1Name, winningScore,
    twoDiceMode, doubleSixMode, highStakesMode,
    lastRoll, rollCount, multiplierThreshhold;

//------------------------------------------------------------------------------------//

//== SET INITIAL VALUES ==
init();

//------------------------------------------------------------------------------------//

//== RESET THE GAME TO ITS INITIAL STATE ==
function init(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;
    lastRoll = 0;
    rollCount = 0;
    multiplierThreshhold = 5;
    settingsModal = document.querySelector('.settings-modal');

    //Set UI scores to 0
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    //Updates the game settings or sets undefined values to defaults if needed
    updateSettings();

    //Hide the dice
    document.querySelector('.dice').style.display = 'none';

    //Remove Winning and Active classes from both players
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');

    //Set player 1 to the active player
    document.querySelector('.player-0-panel').classList.add('active');

    //Set the state to true
    gamePlaying = true;
    console.log(doubleSixMode, highStakesMode, twoDiceMode);
}

//------------------------------------------------------------------------------------//
//== UPDATE ALL OF THE SETTINGS IN THE GAME AND SET VALUES IF UNDEFINED ==
function updateSettings(){
    updatePlayerNames();
    updateWinningScore();
    updateToggleSettings();
}


//== UPDATE THE NAMES OF THE PLAYERS WITHIN THE UI ==
function updatePlayerNames(){
        
    if(player0Name === undefined || player0Name.trim().length === 0){
        player0Name = 'Player 1'
    }
    
    if(player1Name === undefined || player1Name.trim().length === 0){
        player1Name = 'Player 2'
    }
        
    document.getElementById('name-0').textContent = player0Name;
    document.getElementById('name-1').textContent = player1Name;
}

//== UPDATE THE WINNING SCORE OF THE GAME ==
function updateWinningScore(){
    if(winningScore === undefined || winningScore < 25 || winningScore > 999){
        winningScore = 100;
    }
    
    document.querySelector('.header-text').textContent = `First Player to ${winningScore} Wins!`;
}

//== UPDATE THE TOGGLE SETTINGS OF THE GAME ==
function updateToggleSettings(){
    var twoDiceLabel, doubleSixLabel, highStakesLabel, dieOneDOM, dieTwoDOM;

    //Set the mode to false if undefined or keep it the same if defined
    twoDiceMode = (twoDiceMode === undefined) ? false : twoDiceMode;
    doubleSixMode = (doubleSixMode === undefined) ? false : doubleSixMode;
    highStakesMode = (highStakesMode === undefined) ? false : highStakesMode;

    //Manipulate the switch within the UI
    document.getElementById('toggle-number-of-dice').checked = (twoDiceMode) ? true : false;
    document.getElementById('toggle-double-six').checked = (doubleSixMode) ? true : false;
    document.getElementById('toggle-high-stakes').checked = (highStakesMode) ? true : false;

    //Change the text content of the label based on the switch position
    twoDiceLabel = document.getElementById('number-of-dice-label');
    doubleSixLabel = document.getElementById('double-six-label');
    highStakesLabel = document.getElementById('high-stakes-label');

    dieOneDOM = document.getElementById('dice-1');
    dieTwoDOM = document.getElementById('dice-2');

    twoDiceLabel.textContent = (twoDiceMode) ? '2 is always better!' : '1';
    doubleSixLabel.textContent = (doubleSixMode) ? 'Do it for the Six!' : 'Off';
    highStakesLabel.textContent = (highStakesMode) ? 'Riskssskyyy!' : 'Off';

    (doubleSixMode) ? doubleSixLabel.classList.add('setting-on-label') : doubleSixLabel.classList.remove('setting-on-label');
    (highStakesMode) ? highStakesLabel.classList.add('setting-on-label') : highStakesLabel.classList.remove('setting-on-label');

    //Add two dice to the UI if 2 dice mode is enabled
    if(twoDiceMode){
        dieOneDOM.classList.remove('single-die');
        dieOneDOM.classList.add('left-die');
        dieOneDOM.style.display = 'block';
        dieTwoDOM.style.display = 'block';
        twoDiceLabel.classList.add('setting-on-label')
    }else{
        dieOneDOM.classList.remove('left-die');
        dieOneDOM.classList.remove('single-die');
        dieOneDOM.classList.add('single-die');
        dieOneDOM.style.display = 'block';
        dieTwoDOM.style.display = 'none';
        twoDiceLabel.classList.remove('setting-on-label');
    }

}

//------------------------------------------------------------------------------------//

//== HANDLE THE ACTION WHEN THE ROLL BUTTON IS CLIKCED ==
document.querySelector('.btn-roll').addEventListener('click', function(){

    if(gamePlaying){
        //1. We need a random number
        var dice = Math.floor(Math.random() * 6) + 1;


        //2. Display the result
        var diceDOM =  document.querySelector('.dice');
        diceDOM.style.display = 'block';
        diceDOM.src = 'dice-' + dice + '.png';

        //3. Update the round score if none of the rules are triggered
        if((dice === 1) ||
           (doubleSixMode && !twoDiceMode && lastRoll === 6 && dice === 6)){
            switchPlayers();
        }else{
            roundScore += (highStakesMode && ++rollCount >= multiplierThreshhold) ? dice * 2 : dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
            lastRoll = dice;
        }
    }
});

//------------------------------------------------------------------------------------//

//== HANDLE THE ACTION WHEN THE HOLD BUTTON IS CLIKCED ==
document.querySelector('.btn-hold').addEventListener('click', function(){
    if(gamePlaying){
        //1. Add the current score to the players global score
        scores[activePlayer] += roundScore;

        //2. Update the UI
        document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

        //3. Check if the player has won the game
        if(scores[activePlayer] >= winningScore){
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('.dice').style.display = 'none';
            document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
            document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
            gamePlaying = false;
        }else{
            switchPlayers();
        }
    }
});


//------------------------------------------------------------------------------------//

//== HANDLE SCENARIOS WHEN WE SWITCH FROM ONE PLAYER TO THE NEXT ==
function switchPlayers(){
    activePlayer === 0? activePlayer = 1 : activePlayer = 0;
    roundScore = 0;
    lastRoll = 0;
    rollCount = 0;

    //Reset the round score of both players in the UI
    document.getElementById('current-0').textContent = 0;
    document.getElementById('current-1').textContent = 0;

    //Toggle the active class between the players to reflect who's turn it is
    document.querySelector('.player-0-panel').classList.toggle('active');
    document.querySelector('.player-1-panel').classList.toggle('active');

    //Hide the dice when switching players
    document.querySelector('.dice').style.display = 'none';
}

//------------------------------------------------------------------------------------//

//== HANDLE THE ACTION WHEN THE NEW GAME BUTTON IS PRESSED ==
document.querySelector('.btn-new').addEventListener('click', init);

//------------------------------------------------------------------------------------//

//== HANDLE THE ACTION WHEN THE SETTINGS BUTTON IS CLICKED ==
document.querySelector('.btn-settings').addEventListener('click', function(){
    document.getElementById('player-0-name').placeholder = player0Name;
    document.getElementById('player-1-name').placeholder = player1Name;
    document.getElementById('winning-score-input').placeholder = winningScore;
    openModal(settingsModal);
    document.getElementById('player-0-name').focus();
});

//== HANDLE WHEN NUMBER OF DICE IS TOGGLED IN THE SETTINGS MENU ==
document.getElementById('toggle-number-of-dice').addEventListener('click', function(){
    var label;

    label = document.getElementById('number-of-dice-label');

    if(document.getElementById('toggle-number-of-dice').checked){
        label.textContent = '2 is always better!'
    }else{
        label.textContent = '1';
    }

    label.classList.toggle('setting-on-label');
});


//== HANDLE WHEN DOUBLE SIX'S IS TOGGLED IN THE SETTINGS MENU ==
document.getElementById('toggle-double-six').addEventListener('click', function(){
    var label;

    label = document.getElementById('double-six-label');

    if(document.getElementById('toggle-double-six').checked){
        label.textContent = 'Do it for the Six!'
    }else{
        label.textContent = 'Off';
    }

    label.classList.toggle('setting-on-label');
});


//== HANDLE WHEN HIGH STAKES MODE IS TOGGLED IN THE SETTINGS MENU ==
document.getElementById('toggle-high-stakes').addEventListener('click', function(){
    var label;

    label = document.getElementById('high-stakes-label');

    if(document.getElementById('toggle-high-stakes').checked){
        label.textContent = 'Riskssskyyy!'
    }else{
        label.textContent = 'Off';
    }

    label.classList.toggle('setting-on-label');
});

//== HANDLE ACTION WHEN THE SAVE BUTTON IS CLICKED WITHIN THE SETTINGS MODAL ==
document.getElementById('btn-save-game-settings').addEventListener('click', saveGameSettings);

//== HANDLE ACTION WHEN ENTER IS PRESSED FROM WITHIN THE SETTINGS MODAL ==
document.addEventListener('keypress', function(event){
   if(settingsModal.style.display === 'block' && event.which === 13){
        saveGameSettings();
   }
});

//== SAVE THE SETTINGS OF THE GAME ==
function saveGameSettings(){
    //Get the values from the input field
    player0Name = document.getElementById('player-0-name').value;
    player1Name = document.getElementById('player-1-name').value;
    winningScore = document.getElementById('winning-score-input').value;
    twoDiceMode = document.getElementById('toggle-number-of-dice').checked;
    doubleSixMode = document.getElementById('toggle-double-six').checked;
    highStakesMode = document.getElementById('toggle-high-stakes').checked;
    
    //Reset the Input Values
    document.getElementById('player-0-name').value = "";
    document.getElementById('player-1-name').value = "";
    document.getElementById('winning-score-input').value = "";
    
    //Restart the game and  close the modal
    init();
    closeModal(settingsModal);
}

//== HANDLE ACTION WHEN THE CANCEL BUTTON IS CLICKED WITHIN THE SETTINGS MODAL ==
document.getElementById('btn-cancel-game-settings').addEventListener('click', function(){
    updateToggleSettings();
    closeModal(settingsModal);
});


//------------------------------------------------------------------------------------//
//== GENERAL FUNCTIONS THAT MAY BE REUSED LATER ==
function openModal(modal){
    document.getElementById('modal-overlay').style.display = 'block';
    modal.style.display = 'block';
}

function closeModal(modal){
    document.getElementById('modal-overlay').style.display = 'none';
    modal.style.display = 'none';
}
//------------------------------------------------------------------------------------//
