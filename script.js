 const firebaseConfig = {
    apiKey: "AIzaSyAcOs3hyYea3BM55R5GB-F0hObDbxgNrqA",
    authDomain: "study-web-8cd99.firebaseapp.com",
    databaseURL: "https://study-web-8cd99-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "study-web-8cd99",
    storageBucket: "study-web-8cd99.firebasestorage.app",
    messagingSenderId: "320613093347",
    appId: "1:320613093347:web:5bb57a0b5c83fdc0e09ad6",
    measurementId: "G-TNZD8GNJFT"

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Set name and profile
let userName = '';
let userPic = '';

// DOM elements
const nameBtn = document.getElementById("setNameBtn");
const nameInput = document.getElementById("nameInput");
const profileInput = document.getElementById("profilePicInput");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const chatBox = document.getElementById("chatBox");

nameBtn.onclick = () => {
  userName = nameInput.value || "Anonymous";
  const file = profileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      userPic = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

sendBtn.onclick = () => {
  if (userName && chatInput.value.trim()) {
    db.ref("messages").push({
      name: userName,
      pic: userPic,
      text: chatInput.value,
      time: Date.now()
    });
    chatInput.value = "";
  }
};

// Listen for new messages
db.ref("messages").on("child_added", (snapshot) => {
  const msg = snapshot.val();
  const msgDiv = document.createElement("div");
  msgDiv.className = "message";
  msgDiv.innerHTML = `
    <img src="${msg.pic || 'default.png'}" width="30" height="30" />
    <strong>${msg.name}:</strong> ${msg.text}
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});
