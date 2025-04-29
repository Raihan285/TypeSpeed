// === translations.js ===
const translations = {
    id: {
      retry: "Ulangi",
      leaderboard: "Papan Skor",
      profile: "Profil",
      wpm: "Kata per Menit",
      accuracy: "Akurasi",
      customText: "Ini adalah teks custom untuk latihan mengetik.",
      close: "Tutup",
      leaderboardEmpty: "Belum ada data leaderboard.",
      words: [
        "hujan", "matahari", "kucing", "langit", "rumah", "pohon", "komputer", "internet", "belajar",
        "sekolah", "guru", "pelajar", "main", "game", "buku", "meja", "kursi", "pena", "waktu",
        "berlari", "makan", "minum", "tidur", "jalan", "mobil", "motor", "naik", "turun", "pagi",
        "malam", "siang", "sore", "cepat", "lambat", "mudah", "sulit", "benar", "salah", "baru",
        "lama", "hitam", "putih", "merah", "biru", "kuning", "hijau", "besar", "kecil", "panjang",
        "pendek", "baik", "buruk", "senang", "sedih", "cinta", "benci", "teman", "musuh", "laut",
        "gunung", "hutan", "pantai", "hewan", "burung", "ikan", "ular", "bebek", "ayam",
        "sapi", "kuda", "gajah", "monyet", "pisang", "apel", "jeruk", "mangga", "nasi", "roti",
        "air", "kopi", "teh", "susu", "listrik", "lampu", "kaca", "pintu", "jendela", "atap",
        "tembok", "lantai", "karpet", "sabun", "sikat", "handuk", "baju", "celana", "sepatu", "topi",
        "uang", "kartu", "dompet", "tas", "telepon", "kamera", "radio", "musik", "lagu", "suara"
      ],
      quotes: [
        "Kesuksesan dimulai dari keberanian mencoba.",
        "Jangan tunda pekerjaanmu, lakukan sekarang.",
        "Gagal itu hal biasa, bangkit itu luar biasa.",
        "Setiap langkah kecil mendekatkanmu ke tujuan.",
        "Kerja keras tak pernah mengkhianati hasil.",
        "Mimpi besar dimulai dari langkah pertama.",
        "Percayalah pada dirimu sendiri.",
        "Fokuslah pada solusi, bukan masalah.",
        "Disiplin adalah jembatan antara tujuan dan pencapaian.",
        "Semangat adalah bahan bakar kesuksesan."
      ]
    },
    en: {
      retry: "Retry",
      leaderboard: "Leaderboard",
      profile: "Profile",
      wpm: "Words Per Minute",
      accuracy: "Accuracy",
      customText: "This is custom text for typing practice.",
      close: "Close",
      leaderboardEmpty: "No leaderboard data yet.",
      words: [
        "rain", "sun", "cat", "sky", "house", "tree", "computer", "internet", "study",
        "school", "teacher", "student", "play", "game", "book", "table", "chair", "pen", "time",
        "run", "eat", "drink", "sleep", "walk", "car", "motorcycle", "up", "down", "morning",
        "night", "noon", "evening", "fast", "slow", "easy", "difficult", "right", "wrong", "new",
        "old", "black", "white", "red", "blue", "yellow", "green", "big", "small", "long",
        "short", "good", "bad", "happy", "sad", "love", "hate", "friend", "enemy", "sea",
        "mountain", "forest", "beach", "animal", "bird", "fish", "snake", "duck", "chicken",
        "cow", "horse", "elephant", "monkey", "banana", "apple", "orange", "mango", "rice", "bread",
        "water", "coffee", "tea", "milk", "electricity", "lamp", "glass", "door", "window", "roof",
        "wall", "floor", "carpet", "soap", "brush", "towel", "shirt", "pants", "shoes", "hat",
        "money", "card", "wallet", "bag", "phone", "camera", "radio", "music", "song", "sound"
      ],
      quotes: [
        "Success begins with the courage to try.",
        "Don't postpone your work, do it now.",
        "Failure is normal, rising again is extraordinary.",
        "Every small step brings you closer to your goal.",
        "Hard work never betrays results.",
        "Big dreams start with the first step.",
        "Believe in yourself.",
        "Focus on solutions, not problems.",
        "Discipline is the bridge between goals and achievement.",
        "Enthusiasm is the fuel of success."
      ]
    }
  };
  
  let currentLang = "id";
  
  function t(key) {
    return translations[currentLang][key] || key;
  }
  
  function getWords() {
    return translations[currentLang].words;
  }
  
  function getQuotes() {
    return translations[currentLang].quotes;
  }