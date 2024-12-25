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

function animate() {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    projectiles.forEach((projectile) => {
        projectile.update();
        console.log("animating")
    })
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

    console.log("shoot")
});

animate();

//  ==================================================================================== //