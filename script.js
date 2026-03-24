let mustPlayMove = false;
let isRolling = false;
let gameMode = 'single';
let currentPlayer = 1;
let diceTotal = 0;
let selectedTiles = [];
let tilesState = [];
let scores = {1: null, 2: null};
let matchWins = {1: 0, 2: 0};

// MODAL VARS
const customModal = document.getElementById("customModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const modalButtons = document.getElementById("modalButtons");
let modalCallback = null;

const modeScreen = document.getElementById("modeScreen");
const gameScreen = document.getElementById("gameScreen");
const matchScoreDisplay = document.getElementById("matchScoreDisplay");
const playerInfo = document.getElementById("playerInfo");
const diceResult = document.getElementById("diceResult");
const selectedSum = document.getElementById("selectedSum");
const tiles = document.getElementById("tiles");

// SAYFA YÜKLENDİĞİNDE MODALLARI GİZLE
document.addEventListener("DOMContentLoaded", () => {
  customModal.classList.add("hidden");
});

/* =======================
   MODAL
======================= */
function showModal(title, message, callback = null, buttons = [{ text: "Tamam", action: "close" }]) {
  modalTitle.innerText = title;
  modalMessage.innerText = message;
  modalCallback = callback;

  modalButtons.innerHTML = "";

  buttons.forEach(btn => {
    const btnElement = document.createElement("button");
    btnElement.innerText = btn.text;

    if (btn.style === 'cancel') {
        btnElement.style.background = '#c0392b';
    }

    btnElement.onclick = () => {
      if (btn.action === "close") {
        closeModal();
      } else if (typeof btn.action === "function") {
        btn.action();
        closeModal();
      }
    };
    modalButtons.appendChild(btnElement);
  });

  customModal.classList.remove("hidden");
}

function closeModal() {
  customModal.classList.add("hidden");
  if (modalCallback) modalCallback();
  modalCallback = null;
}

/* =======================
   EXIT GAME & RETURN MENU
======================= */
function confirmExit() {
  showModal(
    "Oyundan Çık", 
    "Ana menüye dönmek istediğinize emin misiniz?\nMevcut ilerlemeniz kaybedilecek!", 
    null, 
    [
      { text: "Vazgeç", action: "close", style: 'cancel' },
      { text: "Çık", action: () => returnToMainMenu() }
    ]
  );
}

function returnToMainMenu() {
  gameScreen.classList.add("hidden");
  modeScreen.classList.remove("hidden");
}

/* =======================
   GAME START & ROUNDS
======================= */
function startGame(mode) {
  let rules = "";
  if (mode === 'single') {
    rules = "Zar atıp zar toplamına eşdeğer sayıdaki taşları seçerek hamlenizi onaylayın. Oynayacak hamleniz kalmadığında oyun biter.\n\nAmacınız tahtadaki bütün sayıları kapatmak!";
  } else if (mode === 'multi-sirayla') {
    rules = "İki oyuncu tek bir tahtayı paylaşır.3 turu alan maçı alır.\n\nSırayla zar atılıp taşlar kapanır. Oynayacak hamlesi kalmayan ilk kişi o turu kaybeder.";
  } else if (mode === 'multi-karsilikli') {
    rules = " 3 turu alan maçı alır.\n\nHer oyuncu kendi şansını dener. Kapanmayan taşların toplamı 'ceza puanı' olarak yazılır. Tur bitince daha az ceza puanı olan turu kazanır!";
  }

  showModal("Nasıl Oynanır?", rules, () => {
    gameMode = mode;
    matchWins = {1: 0, 2: 0};
    startRound();

    modeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  });
}

function startRound() {
  currentPlayer = 1;
  tilesState = Array(12).fill(true);
  scores = {1: null, 2: null};

  mustPlayMove = false;
  isRolling = false;
  diceTotal = 0;
  selectedTiles = [];

  diceResult.classList.remove("rolling");
  diceResult.innerText = "-";
  selectedSum.innerText = "0";

  renderTiles();
  updatePlayerInfo();
}

/* =======================
   PROCESS ROUND WINNER
======================= */
function processRoundWinner(winner) {
  const s1 = scores[1] !== null ? scores[1] : "-";
  const s2 = scores[2] !== null ? scores[2] : "-";
  const turDetay = gameMode === 'multi-karsilikli' ? `\nOyuncu 1 Ceza: ${s1}  |  Oyuncu 2 Ceza: ${s2}\n` : "";

  if (winner === 0) {
    matchScoreDisplay.innerText = `Skor Durumu: Oyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`;
    showModal("Tur Bitti!", `Bu tur berabere bitti!${turDetay}\n\nGüncel Skor:\nOyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`, () => startRound());
    return;
  }

  matchWins[winner]++;

  // Skor tablosunu anında güncelle
  matchScoreDisplay.innerText = `Skor Durumu: Oyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`;

  if (matchWins[winner] >= 3) {
    showModal(
      "MAÇ BİTTİ!", 
      `🏆 TEBRİKLER!${turDetay}\n\nOyuncu ${winner}, 3 tur kazanarak MAÇI KAZANDI!`,
      () => returnToMainMenu()
    );
  } else {
    showModal("Tur Bitti!", `Bu turu Oyuncu ${winner} kazandı!${turDetay}\n\nGüncel Skor:\nOyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`, () => startRound());
  }
}

/* =======================
   UI
======================= */
function updatePlayerInfo() {
  if (gameMode === 'single') {
    playerInfo.innerText = "";
    matchScoreDisplay.classList.add("hidden");
  } else {
    if (gameMode === 'multi-sirayla') {
      playerInfo.innerText = `Sırayla - Sıra: Oyuncu ${currentPlayer}`;
    } else if (gameMode === 'multi-karsilikli') {
      playerInfo.innerText = `Karşılıklı - Atıyor: Oyuncu ${currentPlayer}`;
    }
    matchScoreDisplay.innerText = `Skor Durumu: Oyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`;
    matchScoreDisplay.classList.remove("hidden");
  }
}

/* =======================
   DICE
======================= */
function rollDice() {
  if (mustPlayMove) {
    showModal("Uyarı", "Önce mevcut hamleni oynamalısın!");
    return;
  }
  if (isRolling) return;

  isRolling = true;
  diceResult.classList.add("rolling");

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

  diceResult.classList.remove("rolling");
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

/* =======================
   MOVE CHECK
======================= */
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

/* =======================
   END TURN
======================= */
function endTurn(isAllClosed = false) {
  const score = isAllClosed ? 0 : tilesState.reduce(
    (sum, open, i) => (open ? sum + i + 1 : sum),
    0
  );

  scores[currentPlayer] = score;

  if (gameMode === 'multi-sirayla') {
    const winner = currentPlayer === 1 ? 2 : 1;
    processRoundWinner(winner);
  } else if (gameMode === 'multi-karsilikli') {
    if (currentPlayer === 1) {
      showModal("Oyuncu 1 Bitti!", `Oyuncu 1'in sahada kalan ceza puanı: ${score}\n\nSıra Oyuncu 2'ye geçiyor!`, () => {
        currentPlayer = 2;
        tilesState = Array(12).fill(true);
        mustPlayMove = false;
        diceTotal = 0;
        selectedTiles = [];

        diceResult.innerText = "-";
        selectedSum.innerText = "0";

        renderTiles();
        updatePlayerInfo();
      });
    } else {
      let winner = 0;
      if (scores[1] < scores[2]) winner = 1;
      else if (scores[2] < scores[1]) winner = 2;

      // Skor tablosu anında güncellensin
      matchScoreDisplay.innerText = `Skor Durumu: Oyuncu 1 [ ${matchWins[1]} - ${matchWins[2]} ] Oyuncu 2`;

      // Yeni turu otomatik başlat
      processRoundWinner(winner);
    }
  } else {
    // Tek oyunculu - direkt oyun bitti
    showModal("Oyun Bitti!", `Kaybettin...\n\nSkorun: ${score}`, () => returnToMainMenu());
  }
}

/* =======================
   TILES
======================= */
function renderTiles() {
  tiles.innerHTML = "";

  tilesState.forEach((open, i) => {
    const tile = document.createElement("div");

    let cls = "tile";
    if (!open) cls += " closed";
    if (selectedTiles.includes(i)) cls += " selected";

    tile.className = cls;
    tile.innerText = i + 1;

    if (open) tile.onclick = () => toggleTile(i);

    tiles.appendChild(tile);
  });
}

function toggleTile(i) {
  selectedTiles.includes(i)
    ? (selectedTiles = selectedTiles.filter(x => x !== i))
    : selectedTiles.push(i);

  selectedSum.innerText = selectedTiles.reduce((a, x) => a + x + 1, 0);
  renderTiles();
}

/* =======================
   CONFIRM MOVE
======================= */
function confirmMove() {
  if (!mustPlayMove) {
    showModal("Uyarı", "Önce zar atmalısın!");
    return;
  }

  const sum = selectedTiles.reduce((a, x) => a + x + 1, 0);
  if (sum !== diceTotal) {
    showModal("Hata", "Seçilen taşlar zarla eşleşmiyor!");
    return;
  }

  selectedTiles.forEach(i => (tilesState[i] = false));
  selectedTiles = [];
  mustPlayMove = false;

  selectedSum.innerText = 0;
  renderTiles();

  const allClosed = tilesState.every(open => !open);

  if (gameMode === 'multi-sirayla') {
    if (allClosed) processRoundWinner(currentPlayer);
    else {
      currentPlayer = currentPlayer === 1 ? 2 : 1;
      updatePlayerInfo();
    }
  } else if (gameMode === 'single') {
    if (allClosed) {
      showModal("Harika!", "Tebrikler! Oyunu tamamladın! (Bütün taşları kapattın)", () => returnToMainMenu());
    }
  } else if (gameMode === 'multi-karsilikli') {
    if (allClosed) {
      scores[currentPlayer] = 0;
      endTurn(true);
    }
  }
}