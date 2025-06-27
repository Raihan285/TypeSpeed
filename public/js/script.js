const words = [
  "hujan", "matahari", "kucing", "langit", "rumah", "pohon", "komputer", "internet", "belajar",
  "sekolah", "guru", "pelajar", "main", "game", "buku", "meja", "kursi", "pena", "waktu",
  "berlari", "makan", "minum", "tidur", "jalan", "mobil", "motor", "naik", "turun", "pagi",
  "malam", "siang", "sore", "cepat", "lambat", "mudah", "sulit", "benar", "salah", "baru",
  "lama", "hitam", "putih", "merah", "biru", "kuning", "hijau", "besar", "kecil", "panjang",
  "pendek", "baik", "buruk", "senang", "sedih", "cinta", "benci", "teman", "musuh", "jalan",
  "laut", "gunung", "hutan", "pantai", "hewan", "burung", "ikan", "ular", "bebek", "ayam",
  "sapi", "kuda", "gajah", "monyet", "pisang", "apel", "jeruk", "mangga", "nasi", "roti",
  "air", "kopi", "teh", "susu", "listrik", "lampu", "kaca", "pintu", "jendela", "atap",
  "tembok", "lantai", "karpet", "sabun", "sikat", "handuk", "baju", "celana", "sepatu", "topi",
  "uang", "kartu", "dompet", "tas", "telepon", "kamera", "radio", "musik", "lagu", "suara",
  "kata", "kalimat", "huruf", "angka", "soal", "jawaban", "ujian", "nilai", "kelas", "rapor",
  "kereta", "pesawat", "kapal", "perahu", "jembatan", "jalanan", "trotoar", "lampu", "rambu", "petunjuk",
  "desa", "kota", "negara", "dunia", "peta", "bendera", "pasar", "toko", "kantor", "hotel",
  "restoran", "kafe", "bioskop", "teater", "museum", "perpustakaan", "kebun", "zoo", "terminal", "bandara"
];


const quotes = [
  "Kesuksesan dimulai dari keberanian mencoba.",
  "Jangan tunda pekerjaanmu, lakukan sekarang.",
  "Gagal itu hal biasa, bangkit itu luar biasa.",
  "Setiap langkah kecil mendekatkanmu ke tujuan.",
  "Kerja keras tak pernah mengkhianati hasil.",
  "Mimpi besar dimulai dari langkah pertama.",
  "Percayalah pada dirimu sendiri.",
  "Fokuslah pada solusi, bukan masalah.",
  "Disiplin adalah jembatan antara tujuan dan pencapaian.",
  "Semangat adalah bahan bakar kesuksesan.",
  "Kesalahan adalah guru terbaik.",
  "Belajar dari hari ini untuk sukses esok.",
  "Sukses bukan akhir, gagal bukan berarti mati.",
  "Tetap bergerak meski perlahan.",
  "Orang hebat tidak dilahirkan, mereka ditempa.",
  "Hidup adalah pilihan, jangan takut memilih.",
  "Perubahan kecil hari ini berdampak besar esok.",
  "Jangan menunggu motivasi, mulailah dulu.",
  "Waktu tidak menunggu, manfaatkan sekarang.",
  "Berani gagal berarti siap berhasil.",
  "Selalu ada jalan untuk yang tidak menyerah.",
  "Berpikir positif membukakan peluang baru.",
  "Tantangan adalah peluang terselubung.",
  "Jadilah versi terbaik dari dirimu.",
  "Usaha keras mengalahkan bakat bila bakat tidak berusaha.",
  "Tidak ada keberhasilan tanpa pengorbanan.",
  "Langkah kecil lebih baik daripada diam.",
  "Kesempatan tidak datang dua kali, ambillah sekarang.",
  "Jangan iri, setiap orang punya waktunya sendiri.",
  "Hidupmu berubah saat kamu berubah.",
  "Bangun pagi adalah langkah awal kesuksesan.",
  "Setiap detik adalah peluang.",
  "Tekad kuat adalah kunci keberhasilan.",
  "Terus belajar, terus tumbuh.",
  "Mimpi tanpa aksi hanyalah khayalan.",
  "Senyum adalah kekuatan tersembunyi.",
  "Berani mencoba adalah setengah dari keberhasilan.",
  "Bekerja cerdas dan keras secara bersamaan.",
  "Lelah boleh, menyerah jangan.",
  "Waktu terbaik untuk mulai adalah sekarang.",
  "Setiap kegagalan mendekatkan pada keberhasilan.",
  "Bermimpi setinggi langit, berpijak di bumi.",
  "Berikan yang terbaik dalam segala hal.",
  "Bersyukur membuka pintu kebahagiaan.",
  "Hargai proses, nikmati hasil.",
  "Tetap rendah hati saat berhasil.",
  "Tindakan kecil bisa berdampak besar.",
  "Konsistensi adalah kunci perubahan.",
  "Orang sukses tidak banyak alasan.",
  "Ketekunan mengalahkan keberuntungan.",
  "Mulai dari sekarang, bukan nanti.",
  "Jangan berhenti sampai bangga.",
  "Percaya proses, nikmati perjalanan."
];


const urlParams = new URLSearchParams(window.location.search);
const urlMode = urlParams.get('mode');

if (urlMode) {
  currentMode = urlMode;
}


const wordContainer = document.getElementById("word-container");
const input = document.getElementById("hiddenInput");
const wpmDisplay = document.getElementById("wpm-display");
const retryBtn = document.getElementById("retryBtn");
const leaderboardModal = document.getElementById("leaderboard-modal");
const leaderboardTableBody = document.getElementById("leaderboard-table-body");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const closeLeaderboard = document.getElementById("close-leaderboard");


let currentMode = "words";
let wordCount = 50;
let timeLimit = 0;
let currentText = "";
let index = 0, startTime = null, endTime = null;
let correctCount = 0, totalTyped = 0;
let timerInterval = null;
let username = localStorage.getItem("username");


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toggleOptionVisibility(mode) {
  document.querySelectorAll(".words-option").forEach(btn => 
    btn.classList.toggle("hidden", mode !== "words")
  );
  document.querySelectorAll(".time-option").forEach(btn => 
    btn.classList.toggle("hidden", mode !== "time")
  );
}



function generateText() {
  clearInterval(timerInterval);

  const langWords = translations[currentLang].words;
  const langQuotes = translations[currentLang].quotes;

  if (currentMode === "words") {
    currentText = shuffle([...langWords]).slice(0, wordCount).join(" ");
  } else if (currentMode === "quote") {
    currentText = langQuotes[Math.floor(Math.random() * langQuotes.length)];
  } else if (currentMode === "custom") {
    currentText = t("customText");
  } else if (currentMode === "time") {
    currentText = shuffle([...langWords]).slice(0, 300).join(" ");
  } else {
    currentText = "This feature is not available yet.";
  }

  renderTextWithScroll();

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

function renderTextWithScroll() {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = '<div id="word-inner"></div>';

  const wordInner = document.getElementById("word-inner");
  currentText.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (i === 0) span.classList.add("active");
    wordInner.appendChild(span);
  });

  index = 0;
  startTime = null;
  endTime = null;
  correctCount = 0;
  totalTyped = 0;
  wpmDisplay.textContent = "";
  input.value = "";
  wordInner.style.transform = "translateY(0)";
}


function renderText() {
  const wordInner = document.getElementById("word-inner");
  wordInner.innerHTML = "";

  currentText.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    if (i === 0) span.classList.add("active");
    wordInner.appendChild(span);
  });

  index = 0;
  startTime = null;
  endTime = null;
  correctCount = 0;
  totalTyped = 0;
  wpmDisplay.textContent = "";
  input.value = "";
}

const autoReplace = {
  "ia": "dia",
  "tdk": "tidak",
  "sdh": "sudah"
};



let typedCharacters = [];

input.addEventListener("keydown", (e) => {
  if (!startTime) startTime = new Date();
  const chars = wordContainer.querySelectorAll("span");

  if (e.key === "Backspace") {
    if (index > 0) {
      index--;
      chars[index].classList.remove("correct", "incorrect");
      chars[index].classList.add("active");
      chars[index + 1]?.classList.remove("active");
      typedCharacters.pop();
      totalTyped--;
    }
    e.preventDefault();
    return;
  }

  if (e.key.length === 1) {
    const currentChar = currentText[index];
    chars[index]?.classList.remove("active");

    if (e.key === currentChar) {
      chars[index]?.classList.add("correct");
      correctCount++;
    } else {
      chars[index]?.classList.add("incorrect");
    }

    typedCharacters.push(e.key);
    index++;
    const lineHeight = 40; 
    const linesVisible = 3;

const currentLine = Math.floor(chars[index]?.offsetTop / lineHeight);
if (currentLine >= linesVisible) {
  document.getElementById("word-inner").style.transform = `translateY(-${(currentLine - linesVisible + 1) * lineHeight}px)`;
}

    totalTyped++;

    if (index < chars.length) {
      chars[index].classList.add("active");
    } else {
      endTime = new Date();
      input.disabled = true;//shdjsd
      showResult();
    }

    if (e.key === " ") {
      const currentInput = typedCharacters.join("");
      const wordsTyped = currentInput.split(" ");
      const lastWord = wordsTyped[wordsTyped.length - 1];
    
      if (autoReplace[lastWord]) {
        const replacement = autoReplace[lastWord];
        const start = index - lastWord.length;
        for (let i = 0; i < replacement.length; i++) {
          if (chars[start + i]) chars[start + i].textContent = replacement[i];
        }
        typedCharacters.splice(-lastWord.length, lastWord.length, ...replacement.split(""));
      }
    }
    

    e.preventDefault(); 
  }
});


document.body.addEventListener("click", (e) => {
  const isDropdown = e.target.closest('#langSelect');
  const isSelectBox = e.target.tagName === "SELECT" || e.target.closest("select");

  if (!isDropdown && !isSelectBox) {
    input.focus();
  }
});


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

retryBtn.addEventListener("click", () => generateText());



toggleOptionVisibility("words");
generateText();



leaderboardBtn.addEventListener("click", () => {
  showLeaderboard(currentMode);
});

closeLeaderboard.addEventListener("click", () => {
  leaderboardModal.classList.remove("show");
});

//function show leaderboard
function showLeaderboard(mode) {
  db.collection("leaderboard")
    .where("mode", "==", mode)
    .orderBy("wpm", "desc")
    .limit(10)
    .get()
    .then((querySnapshot) => {
      leaderboardTableBody.innerHTML = "";

      if (querySnapshot.empty) {
        leaderboardTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;">Belum ada data leaderboard.</td>
          </tr>
        `;
      } else {
        let rank = 1;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.timestamp ? data.timestamp.toDate().toLocaleString() : "unknown";
          leaderboardTableBody.innerHTML += `
            <tr>
              <td>${rank++}</td>
              <td>${data.username}</td>
              <td>${data.wpm}</td>
              <td>${data.accuracy}%</td>
              <td>${data.mode}</td>
              <td>${date}</td>
            </tr>
          `;
        });
      }

      leaderboardModal.classList.add("show"); // BUKA modal!
    })
    .catch((error) => {
      console.error("Error getting leaderboard: ", error);
    });
}

//function database leaderboard
function showResult() {
  const timeTaken = (endTime ? (endTime - startTime) : (timeLimit * 1000)) / 60000;
  const wpm = Math.round((correctCount / 5) / timeTaken);
  const accuracy = ((correctCount / totalTyped) * 100).toFixed(2);

  wpmDisplay.innerHTML = `WPM: ${wpm} <br>Akurasi: ${accuracy}%`;

  if (username) {
    saveToLeaderboard(currentMode, {
      username: username,
      wpm: wpm,
      accuracy: accuracy
    });
  }
}

function saveToLeaderboard(mode, result) {
  db.collection('leaderboard').add({
    mode: mode,
    username: result.username,
    wpm: result.wpm,
    accuracy: result.accuracy,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => console.log('Leaderboard data added'))
  .catch((error) => console.error('Error adding leaderboard data: ', error));
}



//Profile button
const profileButton = document.getElementById("profileBtn");
profileButton.addEventListener("click", () => {
  window.location.href = "/profile/profile.html"; 
});


document.getElementById("langSelect").addEventListener("change", (e) => {
  currentLang = e.target.value;
  updateUI();
});


function updateUI() {
  document.getElementById("retryBtn").textContent = t("retry");
  document.getElementById("leaderboardBtn").textContent = `🏆 ${t("leaderboard")}`;
  document.getElementById("profileBtn").textContent = t("profile");

  const closeBtn = document.getElementById("close-leaderboard");
  if (closeBtn) closeBtn.textContent = t("close");

  if (currentMode === "custom") {
    currentText = t("customText");
    renderText();
  }
}
