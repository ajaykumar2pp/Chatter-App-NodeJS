require('dotenv').config()
const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const dbConfig = require('./src/config/db.config')

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

    //   Handle built-in 'disconnect' event
    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
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