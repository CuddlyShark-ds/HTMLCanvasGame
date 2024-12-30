// Things to do 
// 1. pause enemy spawn during level screen pause

const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext('2d');

const expText = document.getElementById("expText");
const expNeededText = document.getElementById("expNeededText");

const enemies = [];
const particles = [];
const projectiles = [];
let projectileSpeed = 4;
let projectileRadius = 3;
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
    // particles on enemy death
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.splice(index, 1);
        }
        else {
            particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();
        // remove projectiles for off screen
        if(projectile.x + projectile.radius > canvas.width ||
            projectile.x + projectile.radius < 0) {
                projectiles.splice(index, 1);
        }

        if(projectile.y + projectile.radius > canvas.height ||
            projectile.y + projectile.radius < 0) {
                projectiles.splice(index, 1);
        }
    });
    // Check to see if enemies have been hit by projectiles
    enemies.forEach((enemy, index) => {
        enemy.update();
        // after each enemy updates it will check the distance to every projectile.
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            // Removes the enemy
            if(dist - enemy.radius - projectile.radius < 1) {
                enemy.health--;
                if(enemy.health <= 0) {
                    // prevents enemy flicker on death
                    setTimeout(() => {
                        // Remove enemy from game
                        enemies.splice(index, 1);
                        // updates exp text on screen
                        player.currentExp += enemy.expValue;
                        expText.innerHTML = player.currentExp.toString();
                        // player levels up
                        if(player.currentExp >= player.expToLevel) {
                            player.level++;
                            player.currentExp = 0;
                            player.expToLevel = Math.round((player.expToLevel * 2) * 0.65);
                            expText.innerHTML = player.currentExp.toString();
                            expNeededText.innerHTML = player.expToLevel.toString();
                            isPaused = true;
                            levelUpAlert();
                        }
                    
                        for(let i = 0; i < 8; i++) {
                            particles.push(new Particle(
                                enemy.x,
                                enemy.y,
                                Math.random() * 5,
                                enemy.color,
                                {
                                    x: (Math.random() - 0.5) * (Math.random() * 6),
                                    y: (Math.random() - 0.5) * (Math.random() * 6)
                                }
                            ))
                        }
                        // Remove Projectile
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
                else {
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });

        // check for collision with player
        const playerDist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if(playerDist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId);
        }
    });
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

function spawnEnemy() {
    setInterval(() => {
        let radius = 20;
        let x
        let y
        if(!isPaused) {
            // choose a spawn location
            if(Math.random() < 0.5){
                x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                y = Math.random() * canvas.height;
            }
            else {
                x = Math.random() * canvas.width;
                y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
            }

            // get the angle for the enemy to travel on
            const angle = Math.atan2(
                canvas.height / 2 - y,
                canvas.width / 2 - x
            )
            // assigning the x and y velocity based on the angle
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }

            const color = ['grey', 'blue', 'yellow'];
            let numberSelection = Math.floor(Math.random() * 100)
            // choose an enemy type based on random number
            if(numberSelection < 70){
                console.log("grey enemy");
                enemies.push(new Enemy(
                    3,
                    x,
                    y,
                    10,
                    color[0],
                    velocity,
                    1
                ));
            }
            else if(numberSelection < 90) {
                console.log("blue enemy");
                enemies.push(new Enemy(
                    4,
                    x,
                    y,
                    15,
                    color[1],
                    velocity,
                    2
                ));
            }
            else {
                console.log("yellow enemy");
                enemies.push(new Enemy(
                    5,
                    x,
                    y,
                    20,
                    color[2],
                    velocity,
                    3
                ));
            }
        }
    }, 1000)
}

// note upgrades projectile speed, radius, ???

function levelUpAlert(){
    const levelUpBox = document.getElementById("levelUpBox");
    // add a div for level up selection
    const newDiv = document.createElement("div");
    newDiv.className = "levelUpContainer";
    newDiv.setAttribute("id", "alertDiv");
    levelUpBox.appendChild(newDiv);

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

function removeLevelUpAlert() {
    const divToRemove = document.getElementById("alertDiv");
    divToRemove.remove();
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

animate();
spawnEnemy();