const app = { 
    canvas: null,
    context: null,

    keys: [],
    ship: null,
    stars: [],
    rockets: [],
    asteroids: [],

    score: 0,
    lives: 5,
    player: null
}

app.load = () => {
    app.canvas = document.getElementById('canvasgame');
    app.context = app.canvas.getContext('2d');
    app.canvas.width = app.canvas.clientWidth;
    app.canvas.height = app.canvas.clientHeight;

    let startBtn = document.getElementById('startbutton');
    let playerInput = document.getElementById('playerinput');
    let submitBtn = document.getElementById('submitname');
    let playerName = document.getElementById('playername');

    playerInput.style.display = 'none';

    for (let i = 0; i < 500; i++) {
        app.stars.push(new Star());
    }

    app.stars.forEach(star => {
        star.drawStar();
    });

    startBtn.addEventListener('click', () => {

        startBtn.style.display = 'none';
        playerInput.style.display = 'inline';

        submitBtn.addEventListener('click', () => {

            if (playerName.value) {
                playerInput.style.display = 'none';

                app.player = playerName.value;

                app.ship = new Ship();

                for (let i = 0; i < 5; i++) {
                    app.asteroids.push(new Asteroid());
                }

                document.body.addEventListener('keydown', (ev) => {
                    app.keys[ev.key] = true;
                });
                document.body.addEventListener('keyup', (ev) => {
                    app.keys[ev.key] = false;

                    if (ev.keyCode === 32) {
                        for (let i = 0; i < 3; i++) {
                            app.rockets.push(new Rocket(app.ship.angle - i + 1));
                        }
                    }
                });

                document.addEventListener("mousemove", (ev) => {
                    let relativeX = ev.clientX;
                    if (relativeX > 0 && relativeX < app.canvas.width) {
                        app.ship.x = ev.clientX;
                        app.ship.y = ev.clientY;
                    }
                }, false);

                document.addEventListener('click', (ev) => {
                    for (let i = 0; i < 3; i++) {
                        app.rockets.push(new Rocket(app.ship.angle - i + 1));
                    }
                });

                app.render();
            } else alert('Please enter your name to play the game!');
        });

    });
}

class Star {
    constructor() {
        this.visible = true;
        this.x = Math.floor(Math.random() * app.canvas.width);
        this.y = Math.floor(Math.random() * app.canvas.height);
        this.radius = 1 / 2;
        this.angle = Math.floor(Math.random() * 359);
        this.fillColor = 'yellow';
    }

    drawStar() {

        let vAngle = ((Math.PI * 2) / 6);
        let radians = this.angle / Math.PI * 180;

        app.context.fillStyle = this.fillColor;

        app.context.beginPath();

        app.context.arc(this.x - this.radius * Math.cos(vAngle + radians),
            this.y - this.radius * Math.sin(vAngle + radians),
            this.radius, 0, radians);

        app.context.closePath();
        app.context.fill();
    }
}

class Ship {
    constructor() {
        this.visible = true;
        this.x = app.canvas.width / 2;
        this.y = app.canvas.height / 2;
        this.moveLeft = false;
        this.moveRight = false;
        this.speed = 0.5;
        this.vx = 0;
        this.vy = 0;
        this.rotSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        this.fillColor = 'black';
        this.noseX = app.canvas.width / 2;
        this.noseY = app.canvas.height / 2;
    }

    rotateShip(direction) {
        this.angle += this.rotSpeed * direction;
    }

    moveShip() {
        let radians = this.angle / Math.PI * 180;

        if (this.moveRight) {
            this.vx += Math.cos(radians) * this.speed;
            this.vy += Math.sin(radians) * this.speed;
        }

        if (this.moveLeft) {
            this.vx -= Math.cos(radians) * this.speed;
            this.vy -= Math.sin(radians) * this.speed;

        }

        if (this.x < this.radius) {
            this.x = app.canvas.width;
        }

        if (this.x > app.canvas.width) {
            this.x = this.radius;
        }

        if (this.y < this.radius) {
            this.y = app.canvas.height;
        }

        if (this.y > app.canvas.height) {
            this.y = this.radius;
        }

        this.vx *= 0.89;
        this.vy *= 0.89;

        this.x += this.vx;
        this.y += this.vy;

    }

    drawShip() {
        let vAngle = ((Math.PI * 2) / 3);
        let radians = this.angle / Math.PI * 180;

        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);

        app.context.strokeStyle = this.strokeColor;
        app.context.fillStyle = this.fillColor;
        app.context.beginPath();

        for (let i = 0; i < 3; i++) {
            app.context.lineTo(
                this.x - this.radius * Math.cos(vAngle * i + radians),
                this.y - this.radius * Math.sin(vAngle * i + radians));
        }

        app.context.closePath();
        app.context.stroke();
        app.context.fill();
    }

}

class Rocket {
    constructor(angle) {
        this.visible = true;
        this.x = app.ship.noseX;
        this.y = app.ship.noseY;
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.vx = 0;
        this.vy = 0;
    }

    shotRocket() {
        let radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    drawRocket() {
        app.context.fillStyle = 'red';
        app.context.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Asteroid {
    constructor(x, y, radius, rockets, collisionRadius) {
        this.visible = true;
        this.x = x || Math.floor(Math.random() * app.canvas.width);
        this.y = y || Math.floor(Math.random() * app.canvas.height);
        this.speed = 1;
        this.radius = radius || 50;
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        this.collisionRadius = collisionRadius || 46;
        this.rockets = rockets || 1;
    }

    moveAsteroid() {
        let radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;

        if (this.x < this.radius) {
            this.x = app.canvas.width;
        }

        if (this.x > app.canvas.width) {
            this.x = this.radius;
        }

        if (this.y < this.radius) {
            this.y = app.canvas.height;
        }

        if (this.y > app.canvas.height) {
            this.y = this.radius;
        }
    }

    drawAsteroid() {

        let vAngle = ((Math.PI * 2) / 6);
        let radians = this.angle / Math.PI * 180;

        app.context.strokeStyle = this.strokeColor;
        app.context.textAlign = 'center';
        app.context.font = '25px Arial';

        app.context.beginPath();

        switch (this.rockets) {
            case 4:
                app.context.fillStyle = 'rgb(157, 247, 124)';
                app.context.arc(this.x - this.radius / 3 * Math.cos(vAngle + radians),
                    this.y - this.radius / 3 * Math.sin(vAngle + radians),
                    this.radius / 3, 0, radians);
                app.context.fill();
                app.context.fillStyle = 'black';
                app.context.fillText(this.rockets,
                    this.x - this.radius / 3 * Math.cos(vAngle + radians),
                    this.y - this.radius / 3 * Math.sin(vAngle + radians) + 7);
                break;
            case 3:
                app.context.fillStyle = 'rgb(243, 247, 124)';
                app.context.arc(this.x - this.radius / 2 * Math.cos(vAngle + radians),
                    this.y - this.radius / 2 * Math.sin(vAngle + radians),
                    this.radius / 2, 0, radians);
                app.context.fill();
                app.context.fillStyle = 'black';
                app.context.fillText(this.rockets,
                    this.x - this.radius / 2 * Math.cos(vAngle + radians),
                    this.y - this.radius / 2 * Math.sin(vAngle + radians) + 7);
                break;
            case 2:
                app.context.fillStyle = 'rgb(124, 247, 241)';
                app.context.arc(this.x - this.radius * 2 / 3 * Math.cos(vAngle + radians),
                    this.y - this.radius * 2 / 3 * Math.sin(vAngle + radians),
                    this.radius * 2 / 3, 0, radians);
                app.context.fill();
                app.context.fillStyle = 'black';
                app.context.fillText(this.rockets,
                    this.x - this.radius * 2 / 3 * Math.cos(vAngle + radians),
                    this.y - this.radius * 2 / 3 * Math.sin(vAngle + radians) + 7);
                break;
            case 1:
                app.context.fillStyle = 'rgb(247, 169, 124)';
                app.context.arc(this.x - this.radius * Math.cos(vAngle + radians),
                    this.y - this.radius * Math.sin(vAngle + radians),
                    this.radius, 0, radians);
                app.context.fill();
                app.context.fillStyle = 'black';
                app.context.fillText(this.rockets,
                    this.x - this.radius * Math.cos(vAngle + radians),
                    this.y - this.radius * Math.sin(vAngle + radians) + 7);
                break;
        }

        app.context.closePath();
        app.context.stroke();
    }
}

app.collision = (a1x, a1y, r1, a2x, a2y, r2) => {
    let dx = a1x - a2x,
        dy = a1y - a2y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= r1 + r2) {
        return true; //there is collision
    } else return false; //there is no collision
}

app.render = () => {

    app.ship.moveLeft = (app.keys['ArrowLeft']);
    app.ship.moveRight = (app.keys['ArrowRight']);

    if (app.keys['c'] || app.keys['C']) {
        app.ship.rotateShip(1);
    }
    if (app.keys['z'] || app.keys['Z']) {
        app.ship.rotateShip(-1);
    }

    app.context.clearRect(0, 0, app.canvas.width, app.canvas.height);

    app.context.fillStyle = 'white';
    app.context.font = '15px Arial';
    app.context.fillText('SCORE: ' + app.score.toString(), 50, 35);
    app.context.fillText('LIVES: ' + app.lives.toString(), 150, 35);

    //ship - asteroid collision
    if (app.asteroids.length !== 0) {
        for (let i = 0; i < app.asteroids.length; i++) {
            if (app.collision(app.ship.x, app.ship.y, app.ship.radius, app.asteroids[i].x, app.asteroids[i].y, app.asteroids[i].collisionRadius)) {
                if (app.lives > 0) {
                    app.ship.x = app.canvas.width / 2;
                    app.ship.y = app.canvas.height / 2;
                    app.ship.vx = 0;
                    app.ship.vy = 0;

                    // restart game
                    app.asteroids.length = 0;
                    for (let i = 0; i < 5; i++) {
                        app.asteroids.push(new Asteroid());
                        app.asteroids[i].visible = true;
                    }

                    app.lives--;
                }
            }
        }
    }

    //asteroids - bullets collison
    if (app.asteroids.length !== 0 && app.rockets.length !== 0) {
        loop1: for (let i = 0; i < app.asteroids.length; i++) {
            for (let j = 0; j < app.rockets.length; j++) {
                if (app.collision(app.rockets[j].x, app.rockets[j].y, 3,
                        app.asteroids[i].x, app.asteroids[i].y, app.asteroids[i].collisionRadius) && app.rockets[j].visible) {
                    if (app.asteroids[i].rockets === 1) {
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 2, 22));
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 2, 22));
                    } else if (app.asteroids[i].rockets === 2) {
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 3, 12));
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 3, 12));
                    } else if (app.asteroids[i].rockets === 3) {
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 4, 12));
                        app.asteroids.push(new Asteroid(app.asteroids[i].x,
                            app.asteroids[i].y, app.asteroids[i].radius, 4, 12));
                    }

                    app.asteroids.splice(i, 1);
                    app.rockets.splice(j, 1);
                    app.score += 20;

                    //one bonus live at reaching 500 points more
                    if (app.score > 0 && app.score % 500 === 0 && app.lives < 5 && app.lives > 0) {
                        app.lives++;
                    }

                    break loop1;
                }
            }
        }
    }

    app.stars.forEach(star => {
        star.drawStar();
    });

    if (app.ship.visible) {
        app.ship.moveShip();
        app.ship.drawShip();
    }

    if (app.rockets.length !== 0) {
        app.rockets.forEach(rocket => {
            if (rocket.visible) {
                rocket.shotRocket();
                rocket.drawRocket();
            }
        });
    }

    if (app.asteroids.length !== 0) {
        app.asteroids.forEach(asteroid => {
            if (asteroid.visible) {
                asteroid.moveAsteroid();
                asteroid.drawAsteroid();
            }
        });
    }

    app.context.font = '21px Arial';

    if (app.lives <= 0) {
        let highscores = [];

        app.ship.visible = false;
        app.rockets.forEach(rocket => { rocket.visible = false; });
        app.asteroids.length = 0;

        app.context.fillStyle = 'red';
        app.context.fillText('GAME OVER!', app.canvas.width / 2, 150);

        app.context.fillStyle = 'white';
        app.context.fillText(`Your score is ${app.score}.`, app.canvas.width / 2, 190);
        app.context.fillText('Ranking:', app.canvas.width / 2, 260);

        //local storage
        localStorage.setItem(app.player, app.score.toString());

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let value = parseInt(localStorage[key])
            highscores.push({
                player: key,
                score: value
            });
        }

        highscores.sort((p1, p2) => (p1.score > p2.score) ? -1 : 1);

        for (let i = 0; i < 5; i++) {
            if (highscores[i]) {
                if (highscores[i].player === app.player) {
                    app.context.fillStyle = 'red';
                }
                app.context.fillText(`${highscores[i].player} - ${highscores[i].score} points.`, app.canvas.width / 2, 300 + i * 40);
                app.context.fillStyle = 'white';
            }
        }
    }

    requestAnimationFrame(app.render);
}