const words = [
  "hujan", "matahari", "kucing", "langit", "rumah", "pohon", "komputer", "internet", "belajar",
  "sekolah", "guru", "pelajar", "main", "game", "buku", "meja", "kursi", "pena", "waktu",
  "berlari", "makan", "minum", "tidur", "jalan", "mobil", "motor", "naik", "turun", "pagi",
  "malam", "siang", "sore", "cepat", "lambat", "mudah", "sulit", "benar", "salah", "baru",
  "lama", "hitam", "putih", "merah", "biru", "kuning", "hijau", "besar", "kecil", "panjang",
  "pendek", "baik", "buruk", "senang", "sedih", "cinta", "benci", "teman", "musuh", "jalan"
];

const quotes = [
  "Kesuksesan dimulai dari keberanian mencoba.",
  "Jangan tunda pekerjaanmu, lakukan sekarang.",
  "Gagal itu hal biasa, bangkit itu luar biasa.",
  "Setiap langkah kecil mendekatkanmu ke tujuan."
];

const wordContainer = document.getElementById("word-container");
const input = document.getElementById("hiddenInput");
const wpmDisplay = document.getElementById("wpm-display");
const retryBtn = document.getElementById("retryBtn");
const loginPopup = document.getElementById("login-popup");
const loginForm = document.getElementById("login-form");
const leaderboardContainer = document.getElementById("leaderboard");
const leaderboardList = document.getElementById("leaderboard-list");

let currentMode = "words";
let wordCount = 50;
let currentText = "";
let timeLimit = 0;
let index = 0, startTime = null, endTime = null;
let correctCount = 0, totalTyped = 0;
let timerInterval = null;
let username = null;

// Toggle visibility berdasarkan mode
function toggleOptionVisibility(mode) {
  document.querySelectorAll(".words-option").forEach(btn => 
    btn.classList.toggle("hidden", mode !== "words")
  );
  document.querySelectorAll(".time-option").forEach(btn => 
    btn.classList.toggle("hidden", mode !== "time")
  );
}

// Shuffle array
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Generate teks berdasarkan mode
function generateText() {
  clearInterval(timerInterval);

  if (currentMode === "words") {
    currentText = shuffle([...words]).slice(0, wordCount).join(" ");
  } else if (currentMode === "quote") {
    currentText = quotes[Math.floor(Math.random() * quotes.length)];
  } else if (currentMode === "custom") {
    currentText = "Ini adalah teks custom untuk latihan mengetik.";
  } else if (currentMode === "time") {
    currentText = shuffle([...words]).slice(0, 300).join(" ");
  } else {
    currentText = "Fitur ini belum tersedia.";
  }

  renderText();

  if (currentMode === "time" && timeLimit > 0) {
    let timeLeft = timeLimit;
    wpmDisplay.innerHTML = `⏱ ${timeLeft}s`;

    timerInterval = setInterval(() => {
      timeLeft--;
      wpmDisplay.innerHTML = `⏱ ${timeLeft}s`;

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        input.disabled = true;
        showResult();
      }
    }, 1000);
  }

  input.disabled = false;
  input.focus();
}

// Render karakter satu per satu
function renderText() {
  wordContainer.innerHTML = "";
  currentText.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (i === 0) span.classList.add("active");
    wordContainer.appendChild(span);
  });

  index = 0;
  startTime = null;
  endTime = null;
  correctCount = 0;
  totalTyped = 0;
  wpmDisplay.textContent = "";
  input.value = "";
}

// Tampilkan hasil setelah selesai
function showResult() {
  const timeTaken = (endTime ? (endTime - startTime) : (timeLimit * 1000)) / 60000;
  const wordCountTyped = currentText.trim().split(/\s+/).length;
  const wpm = Math.round((correctCount / 5) / timeTaken);
  const accuracy = ((correctCount / totalTyped) * 100).toFixed(2);

  wpmDisplay.innerHTML = `WPM: ${wpm} <br>Akurasi: ${accuracy}%`;

  if (username) {
    saveToLeaderboard(currentMode, { username, wpm, accuracy });
  }
}

// Simpan data leaderboard (sementara hanya localStorage)
function saveToLeaderboard(mode, result) {
  const key = `leaderboard_${mode}`;
  const list = JSON.parse(localStorage.getItem(key)) || [];
  result.timestamp = new Date().toLocaleString("id-ID");
  list.push(result);
  list.sort((a, b) => b.wpm - a.wpm);
  localStorage.setItem(key, JSON.stringify(list.slice(0, 10))); // top 10
}


// Tampilkan leaderboard
function showLeaderboard(mode) {
  if (!username) {
    loginPopup.classList.remove("hidden");
    return;
  }

  const data = JSON.parse(localStorage.getItem(`leaderboard_${mode}`)) || [];
  leaderboardList.innerHTML = data.map(item =>
    `<li>${item.username}: ${item.wpm} WPM - ${item.accuracy}%</li>`
  ).join("");

  leaderboardContainer.classList.remove("hidden");
}

// Event input mengetik
input.addEventListener("input", () => {
  if (!startTime) startTime = new Date();
  const chars = wordContainer.querySelectorAll("span");
  const typedChar = input.value[input.value.length - 1];
  const currentChar = currentText[index];

  if (!typedChar) return;

  chars[index]?.classList.remove("active");

  if (typedChar === currentChar) {
    chars[index]?.classList.add("correct");
    correctCount++;
  } else {
    chars[index]?.classList.add("incorrect");
  }

  index++;
  totalTyped++;

  if (index < chars.length) {
    chars[index].classList.add("active");
  } else {
    endTime = new Date();
    input.disabled = true;
    showResult();
  }

  input.value = "";
});

// Fokus input jika body diklik
document.body.addEventListener("click", () => input.focus());

// Navbar button
document.querySelectorAll(".navbar button").forEach(button => {
  button.addEventListener("click", () => {
    if (button.dataset.mode) {
      currentMode = button.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      toggleOptionVisibility(currentMode);
    }

    if (button.dataset.length) {
      wordCount = parseInt(button.dataset.length);
      currentMode = "words";
      document.querySelectorAll("[data-length]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.querySelector('[data-mode="words"]').classList.add("active");
    }

    if (button.dataset.time) {
      timeLimit = parseInt(button.dataset.time);
      currentMode = "time";
      document.querySelectorAll("[data-time]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.querySelector('[data-mode="time"]').classList.add("active");
    }

    generateText();
  });
});

// Retry
retryBtn.addEventListener("click", () => generateText());

// Login form submit
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const nameInput = document.getElementById("username");
  username = nameInput.value.trim();
  if (username) {
    loginPopup.classList.add("hidden");
    alert(`Selamat datang, ${username}!`);
  }
});

// Leaderboard button
document.getElementById("leaderboardBtn").addEventListener("click", () => {
  showLeaderboard(currentMode);
});

// Inisialisasi awal
toggleOptionVisibility("words");
generateText();


const leaderboardModal = document.getElementById("leaderboard-modal");
const leaderboardTableBody = document.getElementById("leaderboard-table-body");
const closeLeaderboard = document.getElementById("close-leaderboard");

function showLeaderboard(mode) {
  if (!username) {
    loginPopup.classList.remove("hidden");
    return;
  }

  const data = JSON.parse(localStorage.getItem(`leaderboard_${mode}`)) || [];
  leaderboardTableBody.innerHTML = data.map((item, i) => {
    const dateStr = item.timestamp || new Date().toLocaleString("id-ID");
    return `
      <tr>
        <td>${i + 1}</td>
        <td>${item.username}</td>
        <td>${item.wpm}</td>
        <td>${item.accuracy}%</td>
        <td>1:00</td>
        <td>${dateStr}</td>
      </tr>`;
  }).join("");

  leaderboardModal.classList.remove("hidden");
}

closeLeaderboard.addEventListener("click", () => {
  leaderboardModal.classList.add("hidden");
});

document.getElementById("leaderboardBtn").addEventListener("click", () => {
  showLeaderboard(currentMode);
});


