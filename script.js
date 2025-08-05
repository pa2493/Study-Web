let currentChannel = 'general';
let username = localStorage.getItem('username') || 'User';
let profilePic = localStorage.getItem('profilePic') || '';
let studyStartTime = null;
let totalStudySeconds = parseInt(localStorage.getItem('studyTime')) || 0;

// Load existing data on startup
window.onload = () => {
    document.getElementById('username').textContent = username;
    if (profilePic) {
        document.getElementById('profile-pic').src = profilePic;
    }
    document.getElementById('study-time').textContent = formatTime(totalStudySeconds);
    loadMessages(currentChannel);
};

// Switch channels
function switchChannel(channel) {
    saveMessages(currentChannel);
    currentChannel = channel;
    document.getElementById('channel-name').textContent = `# ${channel}`;
    loadMessages(channel);
}

// Set Username
function setUsername() {
    const name = prompt('Enter your name:');
    if (name) {
        username = name;
        localStorage.setItem('username', name);
        document.getElementById('username').textContent = name;
    }
}

// Set Profile Picture
function setProfilePic(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        profilePic = reader.result;
        document.getElementById('profile-pic').src = profilePic;
        localStorage.setItem('profilePic', profilePic);
    };
    if (file) {
        reader.readAsDataURL(file);
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();
    if (text === '') return;

    const chat = document.getElementById('chat');
    const msg = document.createElement('div');
    msg.className = 'message';

    const profileImage = document.createElement('img');
    profileImage.src = profilePic || '';
    profileImage.alt = 'User';
    profileImage.width = 30;

    const content = document.createElement('div');
    content.innerHTML = `<strong>${username}:</strong> ${formatLinks(text)}`;
    content.style.wordBreak = 'break-word';

    msg.appendChild(profileImage);
    msg.appendChild(content);
    chat.appendChild(msg);

    input.value = '';
    saveMessages(currentChannel);
    chat.scrollTop = chat.scrollHeight;
}

// Save messages
function saveMessages(channel) {
    localStorage.setItem(`messages_${channel}`, document.getElementById('chat').innerHTML);
}

// Load messages
function loadMessages(channel) {
    const chat = document.getElementById('chat');
    chat.innerHTML = localStorage.getItem(`messages_${channel}`) || '';
    chat.scrollTop = chat.scrollHeight;
}

// Format links/images
function formatLinks(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlPattern, (url) => {
        if (url.match(/\.(jpeg|jpg|gif|png)$/)) {
            return `<br><img src="${url}" style="max-width:200px; max-height:200px;" />`;
        }
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

// Study Timer
function startStudy() {
    if (studyStartTime === null) {
        studyStartTime = Date.now();
        alert("Study timer started!");
    }
}

function endStudy() {
    if (studyStartTime !== null) {
        const elapsed = Math.floor((Date.now() - studyStartTime) / 1000);
        totalStudySeconds += elapsed;
        localStorage.setItem('studyTime', totalStudySeconds.toString());
        document.getElementById('study-time').textContent = formatTime(totalStudySeconds);
        studyStartTime = null;
        alert("Study timer ended!");
    }
}

function formatTime(seconds) {
    if (seconds < 60) return `Total: ${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `Total: ${mins}m ${sec}s`;
}