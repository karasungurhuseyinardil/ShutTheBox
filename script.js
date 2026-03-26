let mustPlayMove = false;
let isRolling = false;
let gameMode = 'single';
let currentPlayer = 1;
let diceTotal = 0;
let selectedTiles = [];
let tilesState = [];
let scores = { 1: null, 2: null };
let matchWins = { 1: 0, 2: 0 };
let currentLanguage = 'tr';

const translations = {
  tr: {
    languageButton: 'EN',
    modeTitle: 'Oyun Modu Seç',
    singleBtn: 'Tek Oyunculu',
    multiSequentialBtn: 'Çok Oyunculu (Sırayla)',
    multiVersusBtn: 'Çok Oyunculu (Karşılıklı)',
    backBtn: 'Ana Menüye Dön',
    diceLabel: '🎲 Zar',
    rollBtn: 'Zar At',
    selectedTotalLabel: 'Seçilen Toplam',
    confirmBtn: 'Hamleyi Onayla',
    modalDefaultTitle: 'Mesaj',
    ok: 'Tamam',
    cancel: 'Vazgeç',
    exit: 'Çık',
    languageChanged: lang => `Dil değiştirildi: ${lang}`,
    languageName: {
      tr: 'Türkçe',
      en: 'English'
    },
    playerTurnSequential: player => `Sırayla - Sıra: Oyuncu ${player}`,
    playerTurnVersus: player => `Karşılıklı - Atıyor: Oyuncu ${player}`,
    scoreStatus: (p1, p2) => `Skor Durumu: Oyuncu 1 [ ${p1} - ${p2} ] Oyuncu 2`,
    howToPlayTitle: 'Nasıl Oynanır?',
    rules: {
      single:
        'Zar atıp zar toplamına eşdeğer sayıdaki taşları seçerek hamlenizi onaylayın. Oynayacak hamleniz kalmadığında oyun biter.\n\nAmacınız tahtadaki bütün sayıları kapatmak!',
      'multi-sirayla':
        'İki oyuncu tek bir tahtayı paylaşır. 3 turu alan maçı alır.\n\nSırayla zar atılıp taşlar kapanır. Oynayacak hamlesi kalmayan ilk kişi o turu kaybeder.',
      'multi-karsilikli':
        '3 turu alan maçı alır.\n\nHer oyuncu kendi şansını dener. Kapanmayan taşların toplamı "ceza puanı" olarak yazılır. Tur bitince daha az ceza puanı olan turu kazanır!'
    },
    exitTitle: 'Oyundan Çık',
    exitMessage:
      'Ana menüye dönmek istediğinize emin misiniz?\nMevcut ilerlemeniz kaybedilecek!',
    warningTitle: 'Uyarı',
    errorTitle: 'Hata',
    mustPlayExistingMove: 'Önce mevcut hamleni oynamalısın!',
    mustRollFirst: 'Önce zar atmalısın!',
    tilesDoNotMatch: 'Seçilen taşlar zarla eşleşmiyor!',
    roundFinishedTitle: 'Tur Bitti!',
    roundDrawMessage: (detail, p1, p2) =>
      `Bu tur berabere bitti!${detail}\n\nGüncel Skor:\nOyuncu 1 [ ${p1} - ${p2} ] Oyuncu 2`,
    roundWinnerMessage: (winner, detail, p1, p2) =>
      `Bu turu Oyuncu ${winner} kazandı!${detail}\n\nGüncel Skor:\nOyuncu 1 [ ${p1} - ${p2} ] Oyuncu 2`,
    matchFinishedTitle: 'MAÇ BİTTİ!',
    matchWinnerMessage: (winner, detail) =>
      `🏆 TEBRİKLER!${detail}\n\nOyuncu ${winner}, 3 tur kazanarak MAÇI KAZANDI!`,
    penaltyDetail: (s1, s2) => `\nOyuncu 1 Ceza: ${s1}  |  Oyuncu 2 Ceza: ${s2}\n`,
    playerOneFinishedTitle: 'Oyuncu 1 Bitti!',
    playerOneFinishedMessage: score =>
      `Oyuncu 1'in sahada kalan ceza puanı: ${score}\n\nSıra Oyuncu 2'ye geçiyor!`,
    gameOverTitle: 'Oyun Bitti!',
    gameOverMessage: score => `Kaybettin...\n\nSkorun: ${score}`,
    greatTitle: 'Harika!',
    greatMessage: 'Tebrikler! Oyunu tamamladın! (Bütün taşları kapattın)'
  },
  en: {
    languageButton: 'TR',
    modeTitle: 'Choose Game Mode',
    singleBtn: 'Single Player',
    multiSequentialBtn: 'Multiplayer (Turn-Based)',
    multiVersusBtn: 'Multiplayer (Versus)',
    backBtn: 'Back to Main Menu',
    diceLabel: '🎲 Dice',
    rollBtn: 'Roll Dice',
    selectedTotalLabel: 'Selected Total',
    confirmBtn: 'Confirm Move',
    modalDefaultTitle: 'Message',
    ok: 'OK',
    cancel: 'Cancel',
    exit: 'Exit',
    languageChanged: lang => `Language changed: ${lang}`,
    languageName: {
      tr: 'Turkish',
      en: 'English'
    },
    playerTurnSequential: player => `Turn-Based - Current Turn: Player ${player}`,
    playerTurnVersus: player => `Versus - Rolling: Player ${player}`,
    scoreStatus: (p1, p2) => `Score Status: Player 1 [ ${p1} - ${p2} ] Player 2`,
    howToPlayTitle: 'How to Play?',
    rules: {
      single:
        'Roll the dice, select tiles whose total matches the dice total, and confirm your move. The game ends when you have no valid move left.\n\nYour goal is to close all the numbers on the board!',
      'multi-sirayla':
        'Two players share one board. The first to win 3 rounds wins the match.\n\nPlayers roll in turns and close tiles. The first player with no valid move loses that round.',
      'multi-karsilikli':
        'The first to win 3 rounds wins the match.\n\nEach player tries their own luck. The sum of unclosed tiles becomes the "penalty score". At the end of the round, the player with the lower penalty score wins!'
    },
    exitTitle: 'Exit Game',
    exitMessage:
      'Are you sure you want to return to the main menu?\nYour current progress will be lost!',
    warningTitle: 'Warning',
    errorTitle: 'Error',
    mustPlayExistingMove: 'You must play your current move first!',
    mustRollFirst: 'You need to roll the dice first!',
    tilesDoNotMatch: 'Selected tiles do not match the dice total!',
    roundFinishedTitle: 'Round Finished!',
    roundDrawMessage: (detail, p1, p2) =>
      `This round ended in a draw!${detail}\n\nCurrent Score:\nPlayer 1 [ ${p1} - ${p2} ] Player 2`,
    roundWinnerMessage: (winner, detail, p1, p2) =>
      `Player ${winner} won this round!${detail}\n\nCurrent Score:\nPlayer 1 [ ${p1} - ${p2} ] Player 2`,
    matchFinishedTitle: 'MATCH OVER!',
    matchWinnerMessage: (winner, detail) =>
      `🏆 CONGRATULATIONS!${detail}\n\nPlayer ${winner} won the MATCH by taking 3 rounds!`,
    penaltyDetail: (s1, s2) => `\nPlayer 1 Penalty: ${s1}  |  Player 2 Penalty: ${s2}\n`,
    playerOneFinishedTitle: 'Player 1 Finished!',
    playerOneFinishedMessage: score =>
      `Player 1's remaining penalty score: ${score}\n\nNow it is Player 2's turn!`,
    gameOverTitle: 'Game Over!',
    gameOverMessage: score => `You lost...\n\nYour score: ${score}`,
    greatTitle: 'Great!',
    greatMessage: 'Congratulations! You completed the game! (You closed all the tiles)'
  }
};

const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalButtons = document.getElementById('modalButtons');
const modeScreen = document.getElementById('modeScreen');
const gameScreen = document.getElementById('gameScreen');
const matchScoreDisplay = document.getElementById('matchScoreDisplay');
const playerInfo = document.getElementById('playerInfo');
const diceResult = document.getElementById('diceResult');
const selectedSum = document.getElementById('selectedSum');
const tiles = document.getElementById('tiles');
const languageToast = document.getElementById('languageToast');

let modalCallback = null;
let toastTimeout = null;

function t(key, ...args) {
  const value = translations[currentLanguage][key];
  return typeof value === 'function' ? value(...args) : value;
}

function showLanguageToast() {
  if (!languageToast) return;

  const langName = translations[currentLanguage].languageName[currentLanguage];
  languageToast.innerText = t('languageChanged', langName);

  languageToast.classList.remove('hidden');

  requestAnimationFrame(() => {
    languageToast.classList.add('show');
  });

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    languageToast.classList.remove('show');

    setTimeout(() => {
      languageToast.classList.add('hidden');
    }, 250);
  }, 1800);
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'tr' ? 'en' : 'tr';
  localStorage.setItem('gameLanguage', currentLanguage);
  applyTranslations();
  showLanguageToast();
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.getElementById('languageToggleBtn').innerText = t('languageButton');
  document.getElementById('modeTitle').innerText = t('modeTitle');
  document.getElementById('singleBtn').innerText = t('singleBtn');
  document.getElementById('multiSequentialBtn').innerText = t('multiSequentialBtn');
  document.getElementById('multiVersusBtn').innerText = t('multiVersusBtn');
  document.getElementById('backBtn').innerText = t('backBtn');
  document.getElementById('diceLabel').innerText = t('diceLabel');
  document.getElementById('rollBtn').innerText = t('rollBtn');
  document.getElementById('selectedTotalLabel').innerText = t('selectedTotalLabel');
  document.getElementById('confirmBtn').innerText = t('confirmBtn');
  document.getElementById('modalTitle').innerText = t('modalDefaultTitle');
  updatePlayerInfo();
}

document.addEventListener('DOMContentLoaded', () => {
  customModal.classList.add('hidden');

  const savedLang = localStorage.getItem('gameLanguage');

  if (savedLang === 'tr' || savedLang === 'en') {
    currentLanguage = savedLang;
  } else {
    const browserLang = navigator.language || navigator.userLanguage || 'tr';
    currentLanguage = browserLang.toLowerCase().startsWith('en') ? 'en' : 'tr';
  }

  applyTranslations();
});

function showModal(title, message, callback = null, buttons = null) {
  modalTitle.innerText = title;
  modalMessage.innerText = message;
  modalCallback = callback;
  modalButtons.innerHTML = '';

  const safeButtons = buttons || [{ text: t('ok'), action: 'close' }];

  safeButtons.forEach(btn => {
    const btnElement = document.createElement('button');
    btnElement.innerText = btn.text;

    if (btn.style === 'cancel') {
      btnElement.style.background = '#c0392b';
    }

    btnElement.onclick = () => {
      if (btn.action === 'close') {
        closeModal();
      } else if (typeof btn.action === 'function') {
        btn.action();
        closeModal();
      }
    };

    modalButtons.appendChild(btnElement);
  });

  customModal.classList.remove('hidden');
}

function closeModal() {
  customModal.classList.add('hidden');
  if (modalCallback) modalCallback();
  modalCallback = null;
}

function confirmExit() {
  showModal(
    t('exitTitle'),
    t('exitMessage'),
    null,
    [
      { text: t('cancel'), action: 'close', style: 'cancel' },
      { text: t('exit'), action: () => returnToMainMenu() }
    ]
  );
}

function returnToMainMenu() {
  gameScreen.classList.add('hidden');
  modeScreen.classList.remove('hidden');
}

function startGame(mode) {
  showModal(t('howToPlayTitle'), translations[currentLanguage].rules[mode], () => {
    gameMode = mode;
    matchWins = { 1: 0, 2: 0 };
    startRound();

    modeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
  });
}

function startRound() {
  currentPlayer = 1;
  tilesState = Array(12).fill(true);
  scores = { 1: null, 2: null };

  mustPlayMove = false;
  isRolling = false;
  diceTotal = 0;
  selectedTiles = [];

  diceResult.classList.remove('rolling');
  diceResult.innerText = '-';
  selectedSum.innerText = '0';

  renderTiles();
  updatePlayerInfo();
}

function processRoundWinner(winner) {
  const s1 = scores[1] !== null ? scores[1] : '-';
  const s2 = scores[2] !== null ? scores[2] : '-';
  const turDetay = gameMode === 'multi-karsilikli' ? t('penaltyDetail', s1, s2) : '';

  if (winner === 0) {
    matchScoreDisplay.innerText = t('scoreStatus', matchWins[1], matchWins[2]);
    showModal(
      t('roundFinishedTitle'),
      t('roundDrawMessage', turDetay, matchWins[1], matchWins[2]),
      () => startRound()
    );
    return;
  }

  matchWins[winner]++;
  matchScoreDisplay.innerText = t('scoreStatus', matchWins[1], matchWins[2]);

  if (matchWins[winner] >= 3) {
    showModal(
      t('matchFinishedTitle'),
      t('matchWinnerMessage', winner, turDetay),
      () => returnToMainMenu()
    );
  } else {
    showModal(
      t('roundFinishedTitle'),
      t('roundWinnerMessage', winner, turDetay, matchWins[1], matchWins[2]),
      () => startRound()
    );
  }
}

function updatePlayerInfo() {
  if (gameMode === 'single') {
    playerInfo.innerText = '';
    matchScoreDisplay.classList.add('hidden');
  } else {
    if (gameMode === 'multi-sirayla') {
      playerInfo.innerText = t('playerTurnSequential', currentPlayer);
    } else if (gameMode === 'multi-karsilikli') {
      playerInfo.innerText = t('playerTurnVersus', currentPlayer);
    }

    matchScoreDisplay.innerText = t('scoreStatus', matchWins[1], matchWins[2]);
    matchScoreDisplay.classList.remove('hidden');
  }
}

function rollDice() {
  if (mustPlayMove) {
    showModal(t('warningTitle'), t('mustPlayExistingMove'));
    return;
  }

  if (isRolling) return;

  isRolling = true;
  diceResult.classList.add('rolling');

  let rolls = 0;
  const maxRolls = 15;
  const singleDie = !tilesState[6] && !tilesState[7] && !tilesState[8];

  const rollInterval = setInterval(() => {
    const mockD1 = Math.ceil(Math.random() * 6);
    const mockD2 = singleDie ? 0 : Math.ceil(Math.random() * 6);
    diceResult.innerText = mockD1 + mockD2;
    rolls++;

    if (rolls >= maxRolls) {
      clearInterval(rollInterval);
      finalizeRollDice(singleDie);
    }
  }, 50);
}

function finalizeRollDice(singleDie) {
  const d1 = Math.ceil(Math.random() * 6);
  const d2 = singleDie ? 0 : Math.ceil(Math.random() * 6);

  diceTotal = d1 + d2;
  selectedTiles = [];
  mustPlayMove = true;
  isRolling = false;

  diceResult.classList.remove('rolling');
  diceResult.innerText = diceTotal;
  selectedSum.innerText = 0;

  if (!hasValidMove(diceTotal)) {
    mustPlayMove = false;
    setTimeout(() => {
      endTurn();
    }, 1500);
    return;
  }

  renderTiles();
}

function hasValidMove(target) {
  const openTiles = tilesState
    .map((open, i) => (open ? i + 1 : null))
    .filter(Boolean);

  return checkCombo(openTiles, target);
}

function checkCombo(arr, target, index = 0) {
  if (target === 0) return true;
  if (target < 0 || index >= arr.length) return false;

  return (
    checkCombo(arr, target - arr[index], index + 1) ||
    checkCombo(arr, target, index + 1)
  );
}

function endTurn(isAllClosed = false) {
  const score = isAllClosed
    ? 0
    : tilesState.reduce((sum, open, i) => (open ? sum + i + 1 : sum), 0);

  scores[currentPlayer] = score;

  if (gameMode === 'multi-sirayla') {
    const winner = currentPlayer === 1 ? 2 : 1;
    processRoundWinner(winner);
  } else if (gameMode === 'multi-karsilikli') {
    if (currentPlayer === 1) {
      showModal(t('playerOneFinishedTitle'), t('playerOneFinishedMessage', score), () => {
        currentPlayer = 2;
        tilesState = Array(12).fill(true);
        mustPlayMove = false;
        diceTotal = 0;
        selectedTiles = [];

        diceResult.innerText = '-';
        selectedSum.innerText = '0';

        renderTiles();
        updatePlayerInfo();
      });
    } else {
      let winner = 0;
      if (scores[1] < scores[2]) winner = 1;
      else if (scores[2] < scores[1]) winner = 2;

      matchScoreDisplay.innerText = t('scoreStatus', matchWins[1], matchWins[2]);
      processRoundWinner(winner);
    }
  } else {
    showModal(t('gameOverTitle'), t('gameOverMessage', score), () => returnToMainMenu());
  }
}

function renderTiles() {
  tiles.innerHTML = '';

  tilesState.forEach((open, i) => {
    const tile = document.createElement('div');

    let cls = 'tile';
    if (!open) cls += ' closed';
    if (selectedTiles.includes(i)) cls += ' selected';

    tile.className = cls;
    tile.innerText = i + 1;

    if (open) tile.onclick = () => toggleTile(i);

    tiles.appendChild(tile);
  });
}

function toggleTile(i) {
  if (selectedTiles.includes(i)) {
    selectedTiles = selectedTiles.filter(x => x !== i);
  } else {
    selectedTiles.push(i);
  }

  selectedSum.innerText = selectedTiles.reduce((a, x) => a + x + 1, 0);
  renderTiles();
}

function confirmMove() {
  if (!mustPlayMove) {
    showModal(t('warningTitle'), t('mustRollFirst'));
    return;
  }

  const sum = selectedTiles.reduce((a, x) => a + x + 1, 0);

  if (sum !== diceTotal) {
    showModal(t('errorTitle'), t('tilesDoNotMatch'));
    return;
  }

  selectedTiles.forEach(i => {
    tilesState[i] = false;
  });

  selectedTiles = [];
  mustPlayMove = false;

  selectedSum.innerText = 0;
  renderTiles();

  const allClosed = tilesState.every(open => !open);

  if (gameMode === 'multi-sirayla') {
    if (allClosed) {
      processRoundWinner(currentPlayer);
    } else {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updatePlayerInfo();
    }
  } else if (gameMode === 'single') {
    if (allClosed) {
      showModal(t('greatTitle'), t('greatMessage'), () => returnToMainMenu());
    }
  } else if (gameMode === 'multi-karsilikli') {
    if (allClosed) {
      scores[currentPlayer] = 0;
      endTurn(true);
    }
  }
}