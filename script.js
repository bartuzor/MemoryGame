const gameCard = Array.from(document.querySelectorAll('.game__card'));
const gameCards = document.querySelector('.game__cards')
const title = document.querySelector('.congrats')
const btnShuffle = document.querySelector('#reshuffle');
let targetCard = '';
let flippedCards = [];
let isGameStarted = false;
let randomizingCards = true;

function reshuffleListener(){
    btnShuffle.addEventListener('click',()=>{
        flippedCards = [];
        resetGame();
        randomizeGameCard(false);
        title.style.visibility='hidden'
        
    })
}

function forceReflow(element) {
    void element.offsetWidth; // Bu kod, DOM'u zorla yeniden çizer.
}

function shuffle(array){
    return array.sort(() => Math.random()- 0.5);
}

function randomizeGameCard(showFlippedAnimation = true, setCardPositions = false){
    randomizingCards = true;
    btnShuffle.toggleAttribute('disabled');

    gameCard.forEach((card, cardIndex) => {
        const row = Math.ceil((cardIndex + 1) / 5);
        card.classList.remove('matched');
        if (setCardPositions) {
            card.style.top = `${(row - 1) * 130}px`;
            card.style.left = `${(cardIndex % 5) * 150}px`;
        }
        // card.style.zIndex = cardIndex + 1;
       
        if (showFlippedAnimation) card.classList.add('flipped');
    });

setTimeout(()=>{
    gameCard.forEach(card=>{
        card.classList.remove('flipped');
    })

    setTimeout(() => {
        gameCard.forEach((card) => {
            card.classList.add('centered');
        })

        setTimeout(() => {
            const shuffledPieces = shuffle(gameCard);
            let totalCardAnimationTime = 0;
            shuffledPieces.forEach((card, cardIndex) => {
                card.classList.add('centered');
                const row = Math.ceil((cardIndex + 1) / 5);
                card.style.top = `${(row - 1) * 130}px`;
                card.style.left = `${(cardIndex % 5) * 150}px`;
                gameCards.appendChild(card);

                forceReflow(card);

                setTimeout(() => {
                    card.classList.remove('centered');
                }, 100 * cardIndex)

                totalCardAnimationTime += 50 * cardIndex;
            });

            setTimeout(() => {
                btnShuffle.toggleAttribute('disabled');
                randomizingCards = false;
            }, totalCardAnimationTime / 3)
        }, 3000);
    }, 500);
},showFlippedAnimation ? 1000 : 0)

    
}


function explodeConfetti(){
    const duration = 5 * 1000,
  animationEnd = Date.now() + duration,
  defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

const interval = setInterval(function() {
  const timeLeft = animationEnd - Date.now();

  if (timeLeft <= 0) {
    return clearInterval(interval);
  }

  const particleCount = 50 * (timeLeft / duration);

  // since particles fall down, start a bit higher than random
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
  );
  confetti(
    Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  );
}, 250);

}

function cardListeners(){
    gameCard.forEach(card => {
        card.addEventListener('click',() => {
            if (randomizingCards) return;

            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

            if (!isGameStarted){
                startGameWithCard(card);
                return;
            }

            if (flippedCards.length === 2) return;
        
            card.classList.add('flipped');
            flippedCards.push(card);

            if(flippedCards.length === 2 ){
                checkMatch();
            }
        });
    });
}

function startGameWithCard(card){
    isGameStarted = true;
    targetCard = card.dataset.animal;
    card.classList.add('flipped');
    flippedCards.push(card);
    
}
function chechAll(){
    const allMatched = gameCard.every(card => card.classList.contains('matched'));

    if(allMatched){
        title.style.visibility='visible';
        explodeConfetti();
    }
}
function checkMatch(){
    const [firstCard, secondCard] = flippedCards;
    if(secondCard.dataset.animal === firstCard.dataset.animal && secondCard != firstCard ){
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        flippedCards = [];
        targetCard = null;
        isGameStarted = false;
        confetti({
            particleCount: 100,
            spread: 10,
            origin: { y: 0.5, x:0.5 },
        });
        chechAll();
    }
    else{
        setTimeout(()=>{
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
            resetGame();
        },1000);
    }
}

function resetGame(){
    targetCard = null;
    isGameStarted = false;
}

function initializeGame(){
    randomizeGameCard(true, true);
    cardListeners();
    reshuffleListener();
}

initializeGame();
