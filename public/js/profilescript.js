// Cek login status
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

// DOM Elements
const loginSection = document.getElementById('login-section');
const registerSection = document.getElementById('register-section');
const profileSection = document.getElementById('profile-section');

// Tampilkan halaman yang sesuai
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

// Login function
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

// Register function
function register(username, email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      db.collection("users").doc(user.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      localStorage.setItem('joinDate', new Date().toLocaleDateString());
      isLoggedIn = true;
      renderPage();
    })
    .catch((error) => {
      alert('Registrasi gagal: ' + error.message);
    });
}

// Load Profile Data
function loadProfileData() {
  document.getElementById('profile-username').textContent = localStorage.getItem('username') || 'Username';
  document.getElementById('profile-joined').textContent = localStorage.getItem('joinDate') || 'Join Date';
}

// Logout function
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

// Event Listeners
document.getElementById('login-button').addEventListener('click', function() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  login(email, password);
});

document.getElementById('register-button').addEventListener('click', function() {
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

document.getElementById('logout-button').addEventListener('click', function() {
  logout();
});

// Render pertama kali
renderPage();
