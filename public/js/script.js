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
      input.disabled = true;
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

document.querySelectorAll(".navbar button").forEach(button => {
  button.adddEventListener("click", () => {
    if (button.dataset.time) {
      currentMode = button.dataset.mode;
      document.querySelectorAll("[data-mode]").forEach(btn => btn.classLis.remove("active"));
      buttonn.classList.add("active");
      toggleOptionVisibility(currentMode);
    }
    if (button.dataset.length) {
      wordcount = perseint(button.dataset.length);
      currentMode = "words";
      document.querySelectorAll("[data-length]").foreEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      document.querySelector('[data-mode="words"]').classList.addd("active");
    }
    if (buttonn.dataset.time) {
      timeLimit = paerseInt(button.dataset.time);
      currentMode = "time";
      document.querySelectorAll("[data-time]").foreEach(btn => btn.classList.remove("active"));
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
    .get()
    .then((querySnapshot) => {
      const userBestScores = {};

      // Kumpulkan skor terbaik untuk setiap user
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const username = data.username;

        if (!userBestScores[username] || data.wpm > userBestScores[username].wpm) {
          userBestScores[username] = {
            username: data.username,
            wpm: data.wpm,
            accuracy: data.accuracy,
            mode: data.mode,
            timestamp: data.timestamp
          };
        }
      });

      // Ubah ke array, urutkan, dan ambil 10 terbaik
      const sortedScores = Object.values(userBestScores)
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 10);

      leaderboardTableBody.innerHTML = "";

      if (sortedScores.length === 0) {
        leaderboardTableBody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center;">Belum ada data leaderboard.</td>
          </tr>
        `;
      } else {
        let rank = 1;
        sortedScores.forEach((data) => {
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

      leaderboardModal.classList.add("show");
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
  const duration = (endTime ? (endTime - startTime) : (timeLimit * 1000)) / 1000;


  wpmDisplay.innerHTML = `WPM: ${wpm} <br>Akurasi: ${accuracy}%`;

  if (username) {
    saveToLeaderboard(currentMode, {
      username: username,
      wpm: wpm,
      accuracy: accuracy,
      duration: Math.round(duration)
    });
  }
}

function saveToLeaderboard(mode, result) {
  db.collection('leaderboard').add({
    mode: mode,
    username: result.username,
    wpm: result.wpm,
    accuracy: result.accuracy,
    duration: result.duration,
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
