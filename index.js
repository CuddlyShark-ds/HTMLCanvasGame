const canvas = document.querySelector('canvas');
canvas.width = innerWidth;
canvas.height = innerHeight;

const context = canvas.getContext('2d');

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

const player = new Player(
    canvas.width / 2, 
    canvas.height / 2,
    30,
    'purple'
);

//  ==================================== Projectiles ================================= //

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const projectiles = [];
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
                        // Remove enemy
                        enemies.splice(index, 1);
                    
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

addEventListener("click", (event) => {
    // get the angle for the projectile to travel on
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    )
    // assigning the x and y velocity based on the angle
    const velocity = {
        x: Math.cos(angle) * 4,
        y: Math.sin(angle) * 4
    }
    // Pushes a new Projectile object to the projectiles array for rendering
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'purple',
        velocity,
    ));
});
//  ==================================================================================== //
//  ===================== Enemies ====================================================== //
const enemies = [];
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.health = 3;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

function spawnEnemy() {
    setInterval(() => {
        const radius = 20;
        let x
        let y

        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        // NOTE: ===========> enemies color will determine their starting stats.
        const color = ['white', 'blue', 'yellow'];
        // get the angle for the projectile to travel on
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        )
        // assigning the x and y velocity based on the angle
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        enemies.push(new Enemy(
            x,
            y,
            radius,
            color[0],
            velocity
        ));
    }, 1000)
}

//  ==================================================================================== //

const particles = [];
const friction = 0.98;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1
    }

    draw() {
        context.save();
        context.globalAlpha = this.alpha
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}
animate();
spawnEnemy();