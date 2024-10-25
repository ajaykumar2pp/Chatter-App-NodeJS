require('dotenv').config()
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const moment = require('moment')
const dbConfig = require('./src/config/db.config')
const User = require("./src/models/user.model.js")

// Initialize Express app
const app = express();

// *********  Database Connection ************//
dbConfig.connectMongoDB();

//********* Middleware   ***********/ 
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with the server
const io = new Server(server);

// Serve static files (like HTML, CSS, JS) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on("connection", async (socket) => {
    console.log(`New user connected : ${socket.id}`);

    // Username add 
    socket.on("userData", ({ username, password }) => {
        
        // Store user info in the socket object
        socket.username = username;
 
        const newUser = new User({
            username, 
            password,
            date: moment().format('MMMM Do YYYY, h:mm a')
        });
        console.log(newUser)
        newUser.save().then((savedUser) => {
            io.emit('addUser', savedUser);
        });
    })

    //   Handle built-in 'disconnect' event
    socket.on('disconnect', () => {
        const username = socket.username;
        console.log('user disconnected', username);
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