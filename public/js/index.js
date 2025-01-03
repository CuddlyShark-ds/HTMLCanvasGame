const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

// connect front and backend
const socket = io();

// sets pixel ratio
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio; 

const projectiles = []

const expText = document.getElementById("expText");
const expNeededText = document.getElementById("expNeededText");
const startGameBtn = null;

const frontendPlayers = {}

// receive signal 'updatePlayers' from back end
socket.on('updatePlayers', (backendPlayers) => {
    // add frontend players
    for(const id in backendPlayers) {
        const backendPlayer = backendPlayers[id];
        // if a player shows up on the backend create it for the frontend
        if(!frontendPlayers[id]) {
            frontendPlayers[id] = new Player({
                x: backendPlayer.x,
                y: backendPlayer.y,
                radius: 30,
                color: backendPlayer.color
            });
        }
        else {
            frontendPlayers[id].x = backendPlayer.x;
            frontendPlayers[id].y = backendPlayer.y
        }
    }
    // Remove frontend player 
    for(const id in frontendPlayers) {
        // if the player is not in the backend delete them
        if(!backendPlayers[id]) {
            delete frontendPlayers[id];
        }
    }
});


let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    // adding the 0.1 to alpha gives a bit of a streaming tail effect to the enemies and projectiles
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height);

    for(const id in frontendPlayers) {
        const frontendPlayer = frontendPlayers[id];
        frontendPlayer.draw();
    }

}

animate();

// player movement
window.addEventListener('keydown', (event) => {
    if(!frontendPlayers[socket.id]) return;

    if(event.code == 'KeyW') {
        socket.emit('keydown', 'KeyW');
    }
    else if(event.code == 'KeyS') {
        socket.emit('keydown', 'KeyS');
    }

    if(event.code == 'KeyA') {
        socket.emit('keydown', 'KeyA');
    }
    else if(event.code == 'KeyD') {
        socket.emit('keydown', 'KeyD');
    }
});