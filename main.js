'use strict';
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURATION_SEC = 5;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');
const popUp = document.querySelector('.pop-up');
const popUpText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./sound/carrot_pull.mp3');
const alertsound = new Audio('./sound/alert.wav');
const bgsound = new Audio('./sound/bg.mp3');
const bugsound = new Audio('./sound/bug_pull.mp3');
const winSound = new Audio('./sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick);

gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener('click', () => {
  startGame();
  hidePopUp();
});

function startGame() {
  score = 0;
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playsound(bgsound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText('REPLAY?');
  playsound(alertsound);
  stopsound(bgsound);
}

function finisheGame(win) {
  started = false;
  hideGameButton();
  if (win) {
    playsound(winSound);
  } else {
    playsound(bugsound);
  }
  stopGameTimer();
  stopsound(bgsound);
  showPopUpWithText(win ? 'YOU WON !' : 'YOU LOST');
}

function showStopButton() {
  const icon = gameBtn.querySelector('.fas');
  icon.classList.add('fa-stop');
  icon.classList.remove('fa-play');
  gameBtn.style.visibility = 'visible';
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore() {
  gameTimer.style.visibility = 'visible';
  gameScore.style.visibility = 'visible';
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finisheGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes}:${seconds}`;
}

function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
  popUp.classList.add('pop-up--hide');
}
function initGame() {
  field.innerHTML = '';
  gameScore.innerText = CARROT_COUNT;
  // 벌레와 당근을 생성한뒤 field에 추가해줌
  addItem('carrot', CARROT_COUNT, 'img/carrot.png');
  addItem('bug', BUG_COUNT, 'img/bug.png');
}

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.carrot')) {
    //   당근일 때
    target.remove();
    score++;
    playsound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finisheGame(true);
    }
  } else if (target.matches('.bug')) {
    // 벌레일 때
    finisheGame(false);
  }
}

function playsound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopsound(sound) {
  sound.pause();
}
function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('img');
    item.setAttribute('class', className);
    item.setAttribute('src', imgPath);
    item.style.position = 'absolute';
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
