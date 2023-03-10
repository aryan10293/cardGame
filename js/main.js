let useScore = 0
let deckId = 0
let userScore = 0
let aiScore = 0
const score1 = document.getElementById('score1')
const score2 = document.getElementById('score2')
const player1 = document.getElementById('playerOne')
const player2 = document.getElementById('playerTwo')
fetch(`https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        deckId = data['deck_id']

    })
    .catch(err => {
        console.log(`error ${err}`)
});


function blackJack(){
    if(!localStorage.getItem('deck')){
        localStorage.setItem('deck', deckId)
    }
    console.log(localStorage.getItem('deck'))
    const url = `https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deck')}/draw/?count=2`
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
             console.log(data)
            //console.log(deckId)
            start(data)

            const twoSec =  setTimeout(drawSecondcard, 100, data,localStorage.getItem('deck'))
            
        })
        .catch(err => {
           // console.log(deckId)
            console.log(`error ${err}`)
    });
}
 function convertToNumAi(value){
    if(value === 'ACE'){
        if((aiScore + 11) <= 21){
            return 11
        } else {
            return 1
        }
    } else if (value === 'KING' || value === 'QUEEN' || value === 'JACK'){
        return 10
    } else {
        return parseInt(value)
    }
}
function convertToNumUser(value){
    if(value === 'ACE'){
        if(confirm("you've drawn an ACE!! hit ok for 11 or cancel for 1")){
            return 11
        } else {
            return 1
        }
    } else if (value === 'KING' || value === 'QUEEN' || value === 'JACK'){
        return 10
    } else {
        return parseInt(value)
    }
}
function start(data){
    const player1 = document.getElementById('playerOne')
    const player2 = document.getElementById('playerTwo')
    player1.src = data['cards'][0]['image']
    player2.src = data['cards'][1]['image']
    userScore += convertToNumUser(data['cards'][0]['value'])
    aiScore += convertToNumAi(data['cards'][1]['value'])
    score1.innerText = userScore
    score2.innerText = aiScore
    document.getElementById('start').innerText = 'Keep Playing'
}
function drawSecondcard(data, code){
    const url = `https://www.deckofcardsapi.com/api/deck/${code}/draw/?count=2`
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            alert('drawing second cards')
            const player1 = document.getElementById('playerOne')
            player1.src = data['cards'][0]['image']
            userScore += convertToNumUser(data['cards'][0]['value'])
            aiScore += convertToNumAi(data['cards'][1]['value'])
            score1.innerText = userScore

            if(userScore === 21){
                alert('Gameover you hit blackjack')
                // player1.src = ''
                // player2.src = ''
                gettingUserScore()
                restGame()
                startedGame = false
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
    });
}
function hit(){
    const url = `https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deck')}/draw/?count=1`
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            const player1 = document.getElementById('playerOne')
            player1.src = data['cards'][0]['image']
            userScore += convertToNumUser(data['cards'][0]['value'])
            score1.innerText = userScore

            if(userScore > 21){
                alert('Gameover you went over 21 you LOST')
                // player1.src = ''
                // player2.src = ''
                gettingDealerScore()
                restGame()
            } else if(userScore === 21){
                alert('Gameover you hit blackjack')
                // player1.src = ''
                // player2.src = ''
                gettingUserScore()
                restGame()
            } 
        })
        .catch(err => {
            console.log(deckId)
            console.log(`error ${err}`)
    });
}
function stay(){
    score2.innerText = aiScore
    if (aiScore >= 17){
         gameOutcomes()
    }else if(aiScore <= 16){
        const url = `https://www.deckofcardsapi.com/api/deck/${localStorage.getItem('deck')}/draw/?count=1`
        fetch(url)
            .then(res => res.json()) // parse response as JSON
            .then(data => {
               const player2 = document.getElementById('playerTwo')
                aiScore += convertToNumAi(data['cards'][0]['value'])
                score2.innerText = aiScore
                gameOutcomes()
            })
            .catch(err => {
                console.log(deckId)
                console.log(`error ${err}`)
        });
    }
}
function restGame(){
    userScore = 0
    aiScore = 0
    score1.innerText = userScore
    score2.innerText = aiScore
}
function gameOutcomes(){
    if(userScore === aiScore){
        alert(`TIE!!!! keep playing`)
        restGame()
    }
     if(aiScore > 21){
        alert('Gameover Dealer went over 21 you WON')
        gettingUserScore()
        restGame()
    } 
    if(aiScore === 21){
        alert('Gameover Dealer hit blackjack')
        gettingDealerScore()
        restGame()
    } 
     if (aiScore > userScore){
        alert(`Gameover Dealer scored:${aiScore} and you scored:${userScore} you LOST!!!`)
        gettingDealerScore()
        restGame()
    } 
    if (userScore > aiScore){
        alert(`Gameover Dealer scored:${aiScore} and you scored:${userScore} you WON!!!`)
        gettingUserScore()
        restGame()
    } 
}
function gettingDealerScore(){
    let dealScore = localStorage.getItem('dealer')
    dealScore++
    localStorage.setItem('dealer', dealScore)
    document.getElementById('dealerGame').innerText = dealScore
}
function gettingUserScore(){
    let useScore = localStorage.getItem('player')
    useScore++
    localStorage.setItem('player', useScore)
    document.getElementById('userGame').innerText = useScore
}
document.querySelector('#start').addEventListener('click', blackJack)
document.querySelector('#hitMe').addEventListener('click', hit)
document.querySelector('#stay').addEventListener('click', stay)
document.getElementById('reset').addEventListener('click', function(){
    localStorage.clear()
    player1.src = ''
    player2.src = ''
    document.getElementById('userGame').innerText = ''
    document.getElementById('dealerGame').innerText = ''
    restGame()
})
if(!localStorage.getItem('dealer') && !localStorage.getItem('player')){
    localStorage.setItem('dealer', 0)
    localStorage.setItem('player', 0)
} else {
    document.getElementById('userGame').innerText = localStorage.getItem('player')
    document.getElementById('dealerGame').innerText = localStorage.getItem('dealer')
    
}
//  // display card for player 1 and display card for ai 
// // display another card for player 1 also display his total value and continue to show ai first card but hide second 
// // cards 2-10 are scored as is jacks kings and queens are equal to 10
// // aces can equal 1 or 11 give user that choice and make sure ai has correct logic to make right descion
// // if user wants to continue to play make a hit he can draw another card
// else he can stay and will be out of the game 
// // if player stays show ai cards or value
// if ai is 16 or under  he draws another card if 17 0or over then he stays
// // if dealer bust over 21 player 1 wins 
// if dealer doesnt bust then if your score is higher than the ai then you win 

// //local storage 
// //store deck id
// //store wins and loses
// // store cards remaining in deck 
 