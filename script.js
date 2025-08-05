// TODO: ADD YOUR CONFIG HERE
 const firebaseConfig = {
    apiKey: "AIzaSyAcOs3hyYea3BM55R5GB-F0hObDbxgNrqA",
    authDomain: "study-web-8cd99.firebaseapp.com",
    databaseURL: "https://study-web-8cd99-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "study-web-8cd99",
    storageBucket: "study-web-8cd99.firebasestorage.app",
    messagingSenderId: "320613093347",
    appId: "1:320613093347:web:5bb57a0b5c83fdc0e09ad6",
    measurementId: "G-TNZD8GNJFT"

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();

let currentChannel = "general";
let userName = "Anonymous";
let userPhoto = "";

// Refs
const messagesDiv = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const setNameBtn = document.getElementById("setNameBtn");
const profilePicInput = document.getElementById("profilePicInput");

// Load messages
function loadMessages(channel) {
  messagesDiv.innerHTML = "";
  db.ref(`channels/${channel}`).on("child_added", snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<img src="${msg.photo}" /> <strong>${msg.name}</strong>: ${msg.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// Send message
messageForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = messageInput.value;
  db.ref(`channels/${currentChannel}`).push({
    name: userName,
    photo: userPhoto,
    text: text
  });
  messageInput.value = "";
});

// Channel switching
document.querySelectorAll("#channels button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#channels button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentChannel = btn.dataset.channel;
    loadMessages(currentChannel);
  });
});

// Set name & photo
setNameBtn.addEventListener("click", () => {
  const name = prompt("Enter your name:");
  if (!name) return;

  profilePicInput.click();

  profilePicInput.onchange = () => {
    const file = profilePicInput.files[0];
    if (!file) return;

    const storageRef = storage.ref("profiles/" + file.name);
    storageRef.put(file).then(snapshot => {
      snapshot.ref.getDownloadURL().then(url => {
        userName = name;
        userPhoto = url;
        alert("Profile set successfully!");
      });
    });
  };
});

// Study timer
let startTime = null;
document.getElementById("startStudy").onclick = () => {
  startTime = Date.now();
  alert("Study started!");
};

document.getElementById("endStudy").onclick = () => {
  if (!startTime) return alert("Start first!");
  const mins = Math.floor((Date.now() - startTime) / 60000);
  document.getElementById("studyTime").textContent = `Time studied: ${mins} mins`;
  startTime = null;
};

// Load default
loadMessages(currentChannel);
document.querySelector('[data-channel="general"]').classList.add("active");
