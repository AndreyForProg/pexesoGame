class AudioController {
  constructor() {
    this.bgMusic = new Audio('Assets/Audio/creepy.mp3');
    this.flipSound = new Audio('Assets/Audio/flip.wav');
    this.matchSound = new Audio('Assets/Audio/match.wav');
    this.victorySound = new Audio('Assets/Audio/victory.wav');
    this.gameOverSound = new Audio('Assets/Audio/gameover.wav');
    this.bgMusic.volume = 0.2;
    this.bgMusic.loop = true; //зацикливаем нащ трек
  }
  startMusic() {
    this.bgMusic.play();
  }
  stopMusic() {
    this.bgMusic.pause();
    this.bgMusic.correntTime = 0;
  }
  flip() {
    this.flipSound.play();
  }
  match() {
    this.matchSound.play();
  }
  victory() {
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    this.stopMusic();
    this.gameOverSound.play();
  }
}

class PeXeSo {
  constructor(totalTime, cards) {
    this.cardsArray = cards;  //все карты
    this.totalTime = totalTime; //время на игру
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.ticker = document.getElementById('Flips');
    this.AudioControll = new AudioController();
  }
  startGame() {
    this.cardToCheck = null;  //проверяемая карта
    this.totalClicks = 0;  //количество кликов по картам
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];  //угаданные карты
    this.busy = true;
    setTimeout(() => {
      this.AudioControll.startMusic();
      this.shuffleCards(); //перемешиваем карты
      this.countDown = this.startCountDown(); //начало отчета таймера
      this.busy = false;
    }, 500);
    this.hideCards(); //курты рубашкой вверх
    this.timer.innerText = this.timeRemaining;
    this.ticker.innerText = this.totalClicks;
  }
  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    })
  }
  flipCard(card) {
    if(this.canFlipCard(card)) {
      this.AudioControll.flip();
      this.totalClicks++;
      this.ticker.innerText = this.totalClicks;
      card.classList.add('visible');

      //проверяем, это 1я кликнутая или 2я карта
      if(this.cardToCheck)
        this.checkForCardMatch(card);
      else
        this.cardToCheck = card;
    }
  }
  //проверка: совпадает ли кликнутая карта с выбранной ранее
  checkForCardMatch(card) {
    if(this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else
      this.cardMisMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  //если крты угаданы то добавляются в массив matchedCards
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    this.AudioControll.match();
    if (this.matchedCards.length === this.cardsArray.length)
      this.victory();
  }
  //если не угаданы карты, то они скрываются
  cardMisMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }
  //получаем картинку карты
  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }
  //начало отчета таймера
  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0)
        this.gameOver();
    }, 1000);
  }
  gameOver() {
    clearInterval(this.countDown);
    this.AudioControll.gameOver();
    document.getElementById('game-over-text').classList.add('visible');
  }
  victory() {
    clearInterval(this.countDown);
    this.AudioControll.victory();
    document.getElementById('victory-text').classList.add('visible');
  }
//перемешиваем карты в случайном порядке
  shuffleCards() {
    for(let i = this.cardsArray.length - 1; i > 0; i--) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randIndex].style.order = i;
      this.cardsArray[i].style.order = randIndex;
    }
  }
//возможность флипнуть карту
  canFlipCard(card) {
    return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
  }
}

function ready() {
  let overlays = [...document.getElementsByClassName('overlay-text')];
  let cards = Array.from(document.getElementsByClassName('card')),
      game = new PeXeSo(100, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
      let AudioControll = new AudioController();
          // AudioControll.startMusic();
    });
  });
  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}