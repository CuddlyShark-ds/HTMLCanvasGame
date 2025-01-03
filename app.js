const { Socket } = require('engine.io');
const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
// sock.io setup
const server = createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });
const port = 3000;

// allows the use of the files in public dir to be served up to the front end
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname + 'index.html'));
});

// collection of connected players
const backendPlayers = {}

// track users connecting
io.on('connection', (socket) => {
    console.log('a user connected');
    // add a socket unique id property to the players object
    backendPlayers[socket.id] = {
        x: 750 * Math.random(),
        y: 750 * Math.random(),
        color: `hsl(${360 * Math.random()}, 100%, 50%)`
    };

    // emits signal to all players
    io.emit('updatePlayers', backendPlayers);

    // remove player when they disconnect
    socket.on('disconnect', (reason) => {
        delete backendPlayers[socket.id];
        io.emit('updatePlayers', backendPlayers);
    });

    // Player movement
    socket.on('keydown', (keycode) => {
        if(keycode == 'KeyW') {
            backendPlayers[socket.id].y -= 5;
        }
        else if(keycode == 'KeyS') {
            backendPlayers[socket.id].y += 5;
        }
    
        if(keycode == 'KeyA') {
            backendPlayers[socket.id].x -= 5;
        }
        else if(keycode == 'KeyD') {
            backendPlayers[socket.id].x += 5;
        }
    });
});

setInterval(() => {
    io.emit('updatePlayers', backendPlayers);
},15);

server.listen(port, () => {
    console.log(`App listening on port ${port}`)
});