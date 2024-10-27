
const socket = io();


const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const userInput = document.getElementById('username')
const userPassword = document.getElementById('password')
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input')
const chatMessages = document.getElementById('chat-messages')
const typingIndicator = document.getElementById('typing-indicator');
const welcomeMessage = document.getElementById('welcome-message');
const userList = document.getElementById('userList');
const userCount = document.getElementById('userCount');

// Initially hide chat container
chatContainer.style.display = 'none';

// Initially hide typing indicator 
typingIndicator.style.display = 'none';

let username = '';
let password = '';

// Login Form
loginForm.addEventListener('submit', (e) => {
    // console.log(e)
    e.preventDefault();

    username = userInput.value.trim();
    password = userPassword.value.trim();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    // console.log(`Username: ${username} and Password: ${password}`)

    //  Send user name to server
    socket.emit('userData', { username, password });

    // Empty the field
    userInput.value = "";
    userPassword.value = "";

    // Hide the login form and show the chat container
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';

    // Welcome message show
    welcomeMessage.innerText = `• Welcome ${username}`

});



// Scroll to bottom of the chat container
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Message  Display function
function displayMessage(data) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', data.sender === username ? 'sender' : 'receiver');

    messageElement.innerHTML = `
    <img src="https://picsum.photos/200"+ class="user-image" draggable="false" alt="user-icon">
    <div class="message-content">
        <div>
            <div class="message-info">
                <strong>${data.sender}</strong>
                <small>${data.date}</small>
            </div>
            <div class="message-text">
                ${data.message}
            </div>
        </div>
    </div>
   
`;
    chatMessages.appendChild(messageElement);
}

// Typing indicator logic
messageInput.addEventListener('input', () => {
    socket.emit('typing', username);
});

// typing indicator
socket.on('showTyping', (username) => {
    // console.log(username)
    typingIndicator.innerText = `${username} is typing...`;
    typingIndicator.style.display = 'block';

    // Hide typing indicator after 2 seconds
    setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 2000);
});

//  User Message Send
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) {
        alert('Please enter message.');
        return;
    }
    // console.log(`user message: ${message} `)

    if (message) {
        socket.emit('chatMessage', { username, message })

        // Clear input
        messageInput.value = '';
    }
})

// Notification User Message Show
socket.on('notification', (data) => {
    // console.log(data.message)
    //  A new user has joined!
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<p class=" ">${data.message}</p>`;
    chatMessages.appendChild(notification);
    scrollToBottom();
})

// Display Messages
socket.on('previousMessages', (messages) => {
    // console.log("previousMessages", messages);
    messages.forEach((message) => {
        displayMessage(message);
    });

    // Chat scroll bottom
    scrollToBottom();
})

// receiving messages
socket.on('receiveMessage', (data) => {
    // console.log("receiveMessage", data)
    displayMessage(data);

    // Chat scroll bottom
    scrollToBottom();
});

// User active status
socket.on('userStatus', (activeUsers) => {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

     // Update the count of online users
     userCount.textContent = Object.keys(activeUsers).length;

    // Display each active user
    for (let userId in activeUsers) {
        const userItem = document.createElement('li');
        userItem.className = 'list-group-item text-success f5';
        userItem.innerText = `${' • ' + activeUsers[userId]}`;
        userList.appendChild(userItem);
    }
})




