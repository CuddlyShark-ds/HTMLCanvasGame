const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext('2d');

const expText = document.getElementById("expText");
const expNeededText = document.getElementById("expNeededText");
const startGameBtn = null;

let isPaused = false;


const player = new Player(
    canvas.width / 2, 
    canvas.height / 2,
    30,
    'purple'
);


let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    // adding the 0.1 to alpha gives a bit of a streaming tail effect to the enemies and projectiles
    context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();
}

addEventListener("mousedown", (event) => {
    // get the angle for the projectile to travel on
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    // assigning the x and y velocity based on the angle
    const velocity = {
        x: Math.cos(angle) * projectileSpeed,
        y: Math.sin(angle) * projectileSpeed
    }
    // Pushes a new Projectile object to the projectiles array for rendering
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        projectileRadius,
        'purple',
        velocity,
    ));
});

function levelUpAlert(){
    const UIBox = document.getElementById("UIBox");
    // add a div for level up selection
    const newDiv = document.createElement("div");
    newDiv.className = "UIContainer";
    newDiv.setAttribute("id", "alertDiv");
    UIBox.appendChild(newDiv);

    const buttonOne = document.createElement("button");
    buttonOne.setAttribute("id", "btnOne");
    buttonOne.setAttribute("onclick", "perkSelected(this)");
    buttonOne.innerHTML = "Projectile Speed";
    newDiv.appendChild(buttonOne);

    const buttonTwo = document.createElement("button");
    buttonTwo.setAttribute("id", "btnTwo");
    buttonTwo.setAttribute("onclick", "perkSelected(this)");
    buttonTwo.innerHTML = "Projectile Radius";
    newDiv.appendChild(buttonTwo);

    cancelAnimationFrame(animationId);
}

function perkSelected(selection) {
    switch(selection.textContent) {
        case "Projectile Speed":
            projectileSpeed += 2;
            console.log(projectileSpeed);
            removeLevelUpAlert();
            animate();
            break;
        case "Projectile Radius":
            projectileRadius += 2;
            removeLevelUpAlert();
            animate();
            break;
        default:
            break;
    }
    isPaused = false;
}

function removeLevelUpAlert() {
    const divToRemove = document.getElementById("alertDiv");
    divToRemove.remove();
}

function GameOver() {
    const UIBox = document.getElementById("UIBox");
    // add a div to hold the game over popup
    const newDiv = document.createElement("div");
    newDiv.className = "gameOver";
    newDiv.setAttribute("id", "gameOver");
    UIBox.appendChild(newDiv);

    const scoreText = document.createElement("div");
    scoreText.className = "score";
    scoreText.innerHTML = totalScore.toString();
    newDiv.appendChild(scoreText);

    const pointsText = document.createElement("div");
    pointsText.className = "points";
    pointsText.innerHTML = "Points";
    newDiv.appendChild(pointsText);

    const startButton = document.createElement("button");
    startButton.className = "startBtn";
    startButton.setAttribute("onclick", "gameStart(this)")
    startButton.innerHTML = "Start Game";
    newDiv.appendChild(startButton);
}

function gameStart(event){
    const divToRemove = document.getElementById("gameOver");
    divToRemove.remove();

    enemies = [];
    console.log(enemies)
    projectiles = [];
    totalScore = 0;
    player.currentExp = 0;
    player.expToLevel = 10;
    expText.innerHTML = player.currentExp.toString();
    expNeededText.innerHTML = player.expToLevel.toString();
    isPaused = false;
    animate();
}


animate();