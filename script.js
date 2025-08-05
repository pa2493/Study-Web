// Your Firebase config (replace with yours)
 const firebaseConfig = {
    apiKey: "AIzaSyAcOs3hyYea3BM55R5GB-F0hObDbxgNrqA",
    authDomain: "study-web-8cd99.firebaseapp.com",
    databaseURL: "https://study-web-8cd99-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "study-web-8cd99",
    storageBucket: "study-web-8cd99.firebasestorage.app",
    messagingSenderId: "320613093347",
    appId: "1:320613093347:web:5bb57a0b5c83fdc0e09ad6",
    measurementId: "G-TNZD8GNJFT"

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = localStorage.getItem('username') || '';
let profilePic = localStorage.getItem('profilePic') || '';
let currentChannel = 'general'; // default channel

function saveMessage(channel, user, pic, text, timestamp) {
  db.ref('channels/' + channel).push({
    user: user,
    profilePic: pic,
    text: text,
    timestamp: timestamp
  });
}

function displayMessage(user, pic, text, timestamp) {
  const chat = document.getElementById('chat');
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';

  msgDiv.innerHTML = `
    <img src="${pic}" class="profile-pic" />
    <div>
      <strong>${user}</strong> <small>${new Date(timestamp).toLocaleTimeString()}</small><br/>
      ${text}
    </div>
  `;

  chat.appendChild(msgDiv);
  chat.scrollTop = chat.scrollHeight;
}

function loadMessages(channel) {
  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  db.ref('channels/' + channel).on('child_added', snapshot => {
    const msg = snapshot.val();
    displayMessage(msg.user, msg.profilePic, msg.text, msg.timestamp);
  });
}

document.getElementById('sendBtn').onclick = () => {
  const msgInput = document.getElementById('messageInput');
  const text = msgInput.value.trim();
  if (text && username && profilePic) {
    saveMessage(currentChannel, username, profilePic, text, Date.now());
    msgInput.value = '';
  }
};

document.getElementById('setNameBtn').onclick = () => {
  const nameInput = document.getElementById('nameInput').value.trim();
  const picInput = document.getElementById('picInput');
  if (!nameInput || !picInput.files[0]) {
    alert('Please set a name and upload a profile picture.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    profilePic = reader.result;
    username = nameInput;

    localStorage.setItem('username', username);
    localStorage.setItem('profilePic', profilePic);
    document.getElementById('usernameDisplay').innerText = `Hello, ${username}!`;
    document.getElementById('setProfileSection').style.display = 'none';
    document.getElementById('chatSection').style.display = 'block';
    loadMessages(currentChannel);
  };
  reader.readAsDataURL(picInput.files[0]);
};

// Channel switching
document.querySelectorAll('.channel').forEach(button => {
  button.addEventListener('click', () => {
    currentChannel = button.dataset.channel;
    loadMessages(currentChannel);
  });
});

// Initial check
if (username && profilePic) {
  document.getElementById('usernameDisplay').innerText = `Hello, ${username}!`;
  document.getElementById('setProfileSection').style.display = 'none';
  document.getElementById('chatSection').style.display = 'block';
  loadMessages(currentChannel);
}
