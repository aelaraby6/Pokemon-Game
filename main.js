const ball_class = "ball", ball_count = 5, grass_class = "grass", grass_count = 50;
const PLAYER = document.querySelector(".player");
let PLAYER_SPEED = 1.8;
const SOUND = new Audio("assets/coin.mp3");

let score = 0, level = 1, lives = 5, timeLeft = 90;
let gameRunning = false, gameOver = false;
let enemies = [], powerups = [];
let highScore = localStorage.getItem('highScore') || 0;

const Start_Player_position = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
};

let Player_Pos = { x: 0, y: 0 };
let Player_vel = { x: 0, y: 0 };

document.getElementById('highScore').innerHTML = highScore;

class Enemy {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("enemy");
        this.x = Math.random() * (window.innerWidth - 60);
        this.y = Math.random() * (window.innerHeight - 60);
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        document.body.appendChild(this.element);
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > window.innerWidth - 60) this.speedX *= -1;
        if (this.y < 0 || this.y > window.innerHeight - 60) this.speedY *= -1;

        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";

        if (collision(this.element, PLAYER)) {
            lives--;
            updateHUD();
            PLAYER.classList.add('hit');
            setTimeout(() => PLAYER.classList.remove('hit'), 300);
            
            if (lives <= 0) {
                endGame();
            } else {
                Player_Pos = { ...Start_Player_position };
            }
        }
    }

    remove() {
        this.element.remove();
    }
}

class Powerup {
    constructor() {
        this.element = document.createElement("div");
        this.element.classList.add("powerup");
        this.element.innerHTML = "★";
        this.element.style.fontSize = "30px";
        this.element.style.color = "#fff";
        this.element.style.display = "flex";
        this.element.style.alignItems = "center";
        this.element.style.justifyContent = "center";
        this.x = Math.random() * (window.innerWidth - 40);
        this.y = Math.random() * (window.innerHeight - 40);
        this.element.style.left = this.x + "px";
        this.element.style.top = this.y + "px";
        document.body.appendChild(this.element);
    }

    check() {
        if (collision(this.element, PLAYER)) {
            score += 5;
            updateHUD();
            SOUND.play();
            this.remove();
            return true;
        }
        return false;
    }

    remove() {
        this.element.remove();
    }
}

function startGame() {
    document.getElementById('startMenu').style.display = 'none';
    document.getElementById('gameContainer').style.display = 'block';
    gameRunning = true;
    gameOver = false;
    score = 0;
    level = 1;
    lives = 5;
    timeLeft = 90;
    PLAYER_SPEED = 1.8;
    
    generaterandomelement(ball_class, ball_count);
    generaterandomelement(grass_class, grass_count);
    Player_Pos = { ...Start_Player_position };
    
    spawnEnemies(1);
    spawnPowerup();
    
    updateHUD();
    startTimer();
    update();
}

function restartGame() {
    document.getElementById('gameOver').style.display = 'none';
    document.querySelectorAll('.ball, .enemy, .powerup').forEach(el => el.remove());
    enemies = [];
    powerups = [];
    startGame();
}

function update() {
    if (!gameRunning || gameOver) return;

    Player_Pos.x += Player_vel.x;
    Player_Pos.y += Player_vel.y;

    Player_Pos.x = Math.max(0, Math.min(Player_Pos.x, window.innerWidth - 80));
    Player_Pos.y = Math.max(0, Math.min(Player_Pos.y, window.innerHeight - 100));

    PLAYER.style.left = Player_Pos.x + "px";
    PLAYER.style.top = Player_Pos.y + "px";

    checkCollisions();
    
    enemies.forEach(enemy => enemy.move());
    powerups.forEach((powerup, index) => {
        if (powerup.check()) {
            powerups.splice(index, 1);
        }
    });

    requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
    if (!gameRunning || gameOver) return;
    
    if (e.key == "ArrowUp") {
        Player_vel.y = -1 * PLAYER_SPEED;
        PLAYER.style.backgroundImage = "url('assets/player_front.png')";
    }
    if (e.key == "ArrowDown") {
        Player_vel.y = 1 * PLAYER_SPEED;
        PLAYER.style.backgroundImage = "url('assets/player_back.png')";
    }
    if (e.key == "ArrowLeft") {
        Player_vel.x = -1 * PLAYER_SPEED;
        PLAYER.style.backgroundImage = "url('assets/player_left.png')";
    }
    if (e.key == "ArrowRight") {
        Player_vel.x = 1 * PLAYER_SPEED;
        PLAYER.style.backgroundImage = "url('assets/player_right.png')";
    }
    PLAYER.classList.add("walk");
});

window.addEventListener("keyup", (e) => {
    Player_vel.x = 0;
    Player_vel.y = 0;
    PLAYER.classList.remove("walk");
});

function generaterandomelement(className, count) {
    for (let i = 0; i < count; i++) {
        let newelement = document.createElement("div");
        newelement.classList.add(className);
        newelement.style.left = Math.random() * 100 + "%";
        newelement.style.top = Math.random() * 100 + "%";
        document.body.appendChild(newelement);
    }
}

function checkCollisions() {
    let balls = document.querySelectorAll(".ball");
    balls.forEach((ball) => {
        if (collision(ball, PLAYER)) {
            score++;
            updateHUD();
            
            ball.classList.add('collect');
            setTimeout(() => {
                ball.style.left = Math.random() * 100 + "%";
                ball.style.top = Math.random() * 100 + "%";
                ball.classList.remove('collect');
            }, 300);
            
            SOUND.play();
            
            if (score % 10 === 0) {
                levelUp();
            }
        }
    });
}

function levelUp() {
    level++;
    PLAYER_SPEED += 0.15;
    generaterandomelement(ball_class, 3);
    
    if (level % 3 === 0) {
        spawnEnemies(1);
    }
    
    if (level % 3 === 0) {
        spawnPowerup();
    }
    
    updateHUD();
}

function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        enemies.push(new Enemy());
    }
}

function spawnPowerup() {
    powerups.push(new Powerup());
}

function collision($div1, $div2) {
    var x1 = $div1.getBoundingClientRect().left;
    var y1 = $div1.getBoundingClientRect().top;
    var h1 = $div1.clientHeight;
    var w1 = $div1.clientWidth;
    var b1 = y1 + h1;
    var r1 = x1 + w1;

    var x2 = $div2.getBoundingClientRect().left;
    var y2 = $div2.getBoundingClientRect().top;
    var h2 = $div2.clientHeight;
    var w2 = $div2.clientWidth;
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
}

function startTimer() {
    const timer = setInterval(() => {
        if (!gameRunning || gameOver) {
            clearInterval(timer);
            return;
        }
        
        timeLeft--;
        updateHUD();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

function updateHUD() {
    document.getElementById('scoreValue').innerHTML = score;
    document.getElementById('timeValue').innerHTML = timeLeft;
    document.getElementById('levelValue').innerHTML = level;
    document.getElementById('livesValue').innerHTML = lives;
}

function endGame() {
    gameOver = true;
    gameRunning = false;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    document.getElementById('finalScore').innerHTML = score;
    document.getElementById('finalLevel').innerHTML = level;
    document.getElementById('gameContainer').style.display = 'none';
    document.getElementById('gameOver').style.display = 'block';
}