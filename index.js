require('dotenv').config()
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
// const moment = require('moment')
const moment = require('moment-timezone');
const dbConfig = require('./src/config/db.config')
const User = require("./src/models/user.model.js")
const Chat = require("./src/models/chat.model.js")

// Initialize Express app
const app = express();

// *********  Database Connection ************//
dbConfig.connectMongoDB();

//********* Middleware   ***********/ 
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Active user objects
const activeUsers = {};

// Initialize Socket.IO with the server
const io = new Server(server);

// Serve static files (like HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection",  (socket) => {
    console.log(`New user connected : ${socket.id}`);



    // Username add 
    socket.on("userData", async ({ username }) => {

        // Store user info in the activeUsers
        activeUsers[socket.id] = username;

        // Store user info in the socket object
        socket.username = username;

        // Previous messages
        const messages = await Chat.find().sort({ date: -1 });
        // console.log(messages)
        socket.emit('previousMessages', messages.reverse());

        // Welcome the current user
        socket.emit('message', { message: `Welcome ${username} ` });

        const newUser = new User({
            username,
            // password
            // date: moment().format('MMMM Do YYYY, h:mm a')
        });
        // console.log(newUser)

        newUser.save().then((savedUser) => {
            io.emit('addUser', savedUser);
        }).catch(err => console.error('Error saving user:', err));

        // Notify other users about the new connection
        socket.broadcast.emit("notification", { message: `${username} has joined the chat` })

        // Active users list
        io.emit('userStatus', activeUsers);
    })

    // User Message Send
    socket.on('chatMessage', ({ username, message }) => {
        const newMessage = new Chat({
            message,
            sender: username,
            date: moment().tz("Asia/Kolkata").format('MMMM Do YYYY, h:mm a'),
        });
        console.log(newMessage)
        newMessage.save().then(() => {
            io.emit('receiveMessage', newMessage);
        });
        // io.emit('receiveMessage', newMessage);
    })

    // Typing Notification
    socket.on('typing', (username) => {
        socket.broadcast.emit('showTyping', username);
    });

    //   Handle built-in 'disconnect' event
    socket.on('disconnect', () => {
        const username = socket.username;
        if (username) {
            console.log(`${username} has left the chat`);

            // Remove  user from the active users list
            delete activeUsers[socket.id];

            //  Updated active users list
            io.emit('userStatus', activeUsers);

            // Notify user leaving
            io.emit('notification', { message: `${username} has left the chat` });
        } else {
            console.log("User disconnected");
        }

    })
});


const PORT = process.env.PORT || 3000
server.listen(PORT, (err) => {
    if (err) {
        console.error("Server not connected", err)
    } else {
        console.log(`Server starting on port : ${PORT}`)
    }

})