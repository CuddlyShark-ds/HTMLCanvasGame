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
    'blue'
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
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
    });

    enemies.forEach((enemy, index) => {
        enemy.update();

        // after each enemy updates it will check the distance to every projectile.
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if(dist - enemy.radius - projectile.radius < 1) {
                // prevents enemy flicker on death
                setTimeout(() => {
                    enemies.splice(index, 1);
                    projectiles.splice(projectileIndex, 1);
                }, 0);
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
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    // Pushes a new Projectile object to the projectiles array for rendering
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'red',
        velocity
    ));
});
//  ==================================================================================== //

const enemies = [];

class Enemy {
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

        
        const color = 'green'
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
            color,
            velocity
        ));
    }, 1000)
}

animate();
spawnEnemy();