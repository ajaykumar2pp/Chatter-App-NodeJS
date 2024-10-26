
const socket = io();
socket.on('connect', () => {
    console.log('Connected with id:', socket.id);
});

const chatContainer = document.getElementById('chat-container');
const loginContainer = document.getElementById('login-container');
const loginForm = document.getElementById('login-form');
const userInput = document.getElementById('username')
const userPassword = document.getElementById('password')
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input')

// Initially hide chat container
chatContainer.style.display = 'none';

let username = '';
let password = '';

// Login Form
loginForm.addEventListener('submit', (e) => {
    console.log(e)
    e.preventDefault();

    username = userInput.value.trim();
    password = userPassword.value.trim();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    console.log(`Username: ${username} and Password: ${password}`)

    //  Send user name to server
    socket.emit('userData', { username, password });

    // Empty the field
    userInput.value = "";
    userPassword.value = "";

    // Hide the login form and show the chat container
    loginContainer.style.display = 'none';
    chatContainer.style.display = 'block';

});

//  User Message Send
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    const message = messageInput.value.trim();
    if (!message) {
        alert('Please enter message.');
        return;
    }
    console.log(`user message: ${message} `)

    if (message) {
        socket.emit('chatMessage', { username,  message })

        // Clear input
        messageInput.value = '';
    }
})




