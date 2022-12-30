export default function startGame(data,code){
    start(data)

    const twoSec =  setTimeout(drawSecondcard, 2000, data,code)
    
}
 export function convertToNum(value){
    if(value === 'ACE'){
        return 11
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
    userScore += convertToNum(data['cards'][0]['value'])
    aiScore += convertToNum(data['cards'][1]['value'])
    score1.innerText = userScore
    score2.innerText = aiScore
}
function drawSecondcard(data, code){
    const url = `https://www.deckofcardsapi.com/api/deck/${code}/draw/?count=2`
    fetch(url)
        .then(res => res.json()) // parse response as JSON
        .then(data => {
            alert('drawing second cards')
            const player1 = document.getElementById('playerOne')
            player1.src = data['cards'][0]['image']
            userScore += convertToNum(data['cards'][0]['value'])
            aiScore += convertToNum(data['cards'][1]['value'])
            score1.innerText = userScore
        })
        .catch(err => {
            console.log(`error ${err}`)
    });
}