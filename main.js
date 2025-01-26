const ball_class = "ball", ball_count = 5,grass_class = "grass",grass_count = 50;
const PLAYER = document.querySelector(".player");
const PLAYER_SPEED = 1.8;
const SOUND = new Audio("assets/coin.mp3");
const score = document.querySelector(".score span");

const Start_Player_position={
    x: window.innerWidth/2,
    y: window.innerHeight/2,
};

let Player_Pos={
    x:0,
    y:0,
};

let Player_vel={
    x:0,
    y:0,
};

function start() {
    generaterandomelement(ball_class,ball_count);
    generaterandomelement(grass_class,grass_count);
    Player_Pos= Start_Player_position;
 }
function update() {
    Player_Pos.x+=Player_vel.x;
    Player_Pos.y+=Player_vel.y;
    PLAYER.style.left =  Player_Pos.x + "px";
    PLAYER.style.top =  Player_Pos.y + "px";

    checkCollisions();

    requestAnimationFrame(update);
}


window.addEventListener("keydown", (e) => {
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
        newelement.style.top= Math.random() * 100 + "%";
        document.body.appendChild(newelement);
    }
}

function checkCollisions() {
    balls = document.querySelectorAll(".ball");
    balls.forEach((ball) => {
      if (collision(ball, PLAYER)) {
        score.innerHTML++;
        ball.style.left = Math.random() * 100 + "%";
        ball.style.top= Math.random() * 100 + "%";
        SOUND.play();
      }
    });
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
  
  
start();
update();