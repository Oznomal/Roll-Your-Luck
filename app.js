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
var scores, roundScore, activePlayer, gamePlaying;

//------------------------------------------------------------------------------------//

//== SET INITIAL VALUES ==
init();

//------------------------------------------------------------------------------------//

//== RESET THE GAME TO ITS INITIAL STATE ==
function init(){
    scores = [0,0];
    roundScore = 0;
    activePlayer = 0;

    //Set UI scores to 0
    document.getElementById('score-0').textContent = '0';
    document.getElementById('score-1').textContent = '0';
    document.getElementById('current-0').textContent = '0';
    document.getElementById('current-1').textContent = '0';

    //Hide the dice
    document.querySelector('.dice').style.display = 'none';
    
    //Set the names of the players (to remnove 'WINNER' if needed)
    document.getElementById('name-0').textContent = 'Player 1';
    document.getElementById('name-1').textContent = 'Player 2';
    
    //Remove Winning and Active classes from both players
    document.querySelector('.player-0-panel').classList.remove('winner');
    document.querySelector('.player-1-panel').classList.remove('winner');
    document.querySelector('.player-0-panel').classList.remove('active');
    document.querySelector('.player-1-panel').classList.remove('active');
    
    //Set player 1 to the active player
    document.querySelector('.player-0-panel').classList.add('active');
    
    //Set the state to true
    gamePlaying = true;
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

        //3. Update the round score IF the rolled number was NOT a 1
        if(dice !== 1){
            //Add Score
            roundScore += dice;
            document.querySelector('#current-' + activePlayer).textContent = roundScore;
        }else{
            //Next Player
            switchPlayers();
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
        if(scores[activePlayer] >= 100){
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