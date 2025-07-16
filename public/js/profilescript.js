let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const profileSection = document.getElementById('profile-section');

function renderPage() {
  if (isLoggedIn) {
    loginSection.classList.add('hidden');
    registerSection.classList.add('hidden');
    profileSection.classList.remove('hidden');
    loadProfileData();
  } else {
    loginSection.classList.remove('hidden');
    registerSection.classList.remove('hidden');
    profileSection.classList.add('hidden');
  }
}

function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', user.email.split('@')[0]);
      localStorage.setItem('joinDate', new Date().toLocaleDateString());
      isLoggedIn = true;
      renderPage();
    })
    .catch((error) => {
      alert('Login gagal: ' + error.message);
    });
}

// Login dengan Google
function loginWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', user.displayName || user.email.split('@')[0]);
      localStorage.setItem('joinDate', new Date().toLocaleDateString());
      isLoggedIn = true;

      // Simpan ke Firestore jika belum ada
      return db.collection("users").doc(user.uid).set({
        username: user.displayName || user.email.split('@')[0],
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(() => {
      renderPage();
    })
    .catch((error) => {
      alert('Login Google gagal: ' + error.message);
    });
}

// Login dengan GitHub
function loginWithGithub() {
  const provider = new firebase.auth.GithubAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', user.displayName || user.email.split('@')[0]);
      localStorage.setItem('joinDate', new Date().toLocaleDateString());
      isLoggedIn = true;

      // Simpan ke Firestore jika belum ada
      return db.collection("users").doc(user.uid).set({
        username: user.displayName || user.email.split('@')[0],
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
    })
    .then(() => {
      renderPage();
    })
    .catch((error) => {
      alert('Login GitHub gagal: ' + error.message);
    });
}


function register(username, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      return db.collection("users").doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        localStorage.setItem('joinDate', new Date().toLocaleDateString());
        isLoggedIn = true;
        renderPage();
      });
    })
    .catch((error) => {
      alert('Registrasi gagal: ' + error.message);
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      localStorage.clear();
      isLoggedIn = false;
      renderPage();
    })
    .catch((error) => {
      console.error('Logout error:', error);
    });
}

document.getElementById('login-button').addEventListener('click', function () {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  login(email, password);
});

document.getElementById('google-login').addEventListener('click', function () {
  loginWithGoogle();
});

document.getElementById('github-login').addEventListener('click', function () {
  loginWithGithub();
});


document.getElementById('register-button').addEventListener('click', function () {
  const username = document.getElementById('register-username').value;
  const email = document.getElementById('register-email').value;
  const verifyEmail = document.getElementById('register-verify-email').value;
  const password = document.getElementById('register-password').value;
  const verifyPassword = document.getElementById('register-verify-password').value;

  if (email !== verifyEmail) {
    alert('Email tidak cocok!');
    return;
  }
  if (password !== verifyPassword) {
    alert('Password tidak cocok!');
    return;
  }
  register(username, email, password);
});

document.getElementById('logout-button').addEventListener('click', function () {
  logout();
});

renderPage();

let currentMode = "words";
let wordCount = 50;
let timeLimit = 0;

function toggleOptionVisibility(mode) {
  document.querySelectorAll(".words-option").forEach(btn =>
    btn.classList.toggle("hidden", mode !== "words")
  );
  document.querySelectorAll(".time-option").forEach(btn =>
    btn.classList.toggle("hidden", mode !== "time")
  );
}

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
  });
});

document.getElementById("profileBtn")?.addEventListener("click", () => {
  window.location.href = "/profile/profile.html";
});

document.getElementById("leaderboardBtn")?.addEventListener("click", () => {
  window.location.href = "/";
});

toggleOptionVisibility("words");

async function loadTestsStartedCount() {
  const username = localStorage.getItem('username');
  if (!username) return;

  const snapshot = await db.collection("leaderboard").where("username", "==", username).get();
  document.getElementById("tests-started").textContent = snapshot.size;
}

async function loadTestsCompletedCount() {
  const username = localStorage.getItem('username');
  if (!username) return;

  const snapshot = await db.collection("leaderboard").where("username", "==", username).get();
  document.getElementById("tests-completed").textContent = snapshot.size;
}

async function loadTimeTyping() {
  const username = localStorage.getItem('username');
  if (!username) return;

  const snapshot = await db.collection("leaderboard").where("username", "==", username).get();
  let totalSeconds = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.duration) {
      totalSeconds += data.duration;
    } else {
      totalSeconds += data.mode === "time" ? 60 : 45;
    }
  });

  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');

  document.getElementById("time-typing").textContent = `${h}:${m}:${s}`;
}

async function loadXPAndLevel() {
  const username = localStorage.getItem('username');
  if (!username) return;

  const snapshot = await db.collection("leaderboard").where("username", "==", username).get();
  let totalXP = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    const xp = Math.round((data.wpm || 0) + ((data.accuracy || 0) / 2));
    totalXP += xp;
  });

  const level = Math.floor(totalXP / 100);
  const xpInLevel = totalXP % 100;

  document.getElementById("user-level").textContent = `Level: ${level}`;
  document.getElementById("user-xp").textContent = `XP: ${xpInLevel} / 100`;
  document.getElementById("xp-bar").style.width = `${xpInLevel}%`;
}

async function loadBestScore() {
  const username = localStorage.getItem('username');
  if (!username) return;

  const snapshot = await db.collection("leaderboard").where("username", "==", username).get();

  let bestWPM = 0;
  let bestAccuracy = 0;
  let bestDate = null;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.wpm > bestWPM) {
      bestWPM = data.wpm;
      bestAccuracy = data.accuracy || 0;
      bestDate = data.date?.toDate ? data.date.toDate() : null;
    }
  });

  document.getElementById("best-wpm").textContent = bestWPM + " WPM";
  document.getElementById("best-accuracy").textContent = bestAccuracy + "%";
  document.getElementById("best-date").textContent = bestDate
    ? bestDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : "-";
}

function loadProfileData() {
  document.getElementById('profile-username').textContent = localStorage.getItem('username') || 'Username';
  document.getElementById('profile-joined').textContent = localStorage.getItem('joinDate') || 'Join Date';

  loadTestsStartedCount();
  loadTestsCompletedCount();
  loadTimeTyping();
  loadXPAndLevel();
  loadBestScore(); 
}
