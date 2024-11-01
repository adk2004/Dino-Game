const canvas = document.querySelector("#game");
const score = document.querySelector(".Score");
const ctx = canvas.getContext("2d");
const Gimg = new Image();
Gimg.src = "dino_images/ground.png";
const img1 = new Image();
img1.src = "dino_images/dino_run1.png";
const img2 = new Image();
img2.src = "dino_images/dino_run2.png";

let gx = 0;
let dx = 1.75;
let pH = canvas.height * 0.32;
let pW = canvas.width * 0.055;
let pX = 8;
let pY = 80;
let maxHeight = canvas.height * 0.85;
let curImg = img1;
let toggleSpeed = 100;
let lastToggleTime = 0;
let jumpInProgress = false;
let falling = false;
let jumpSpeed = 0.08;
let gravity = 0.08;
let speedFactor = 0.000121;
let lastCactusTime = 0;
let cactusTimeGap = Math.floor(Math.random() * 800) + 1500;
let gameOver = false;
let deltaY = 10;
let delatX = 10;
let cactArr = [];
let call = 0;
let gameScore = 0;
let doneIncrement = false;

const cactiConfig = [
  { width: pW * 0.65, height: pH * 0.8, image: "dino_images/cactus_1.png" },
  { width: pW * 1.05, height: pH * 0.8, image: "dino_images/cactus_2.png" },
  { width: pW * 0.8, height: pH * 0.6, image: "dino_images/cactus_3.png" },
];

Gimg.onload = function () {
  img1.onload = function () {
    img2.onload = function () {
      requestAnimationFrame(animate);
      requestAnimationFrame(runAnimation);
      requestAnimationFrame(cactusLoop);
    };
  };
};

function drawGround() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(Gimg, gx, 120, canvas.width, canvas.height / 10);
  ctx.drawImage(Gimg, gx + canvas.width, 120, canvas.width, canvas.height / 10);
  gx -= dx;
  if (gx <= -canvas.width) {
    gx = 0;
  }
  dx += speedFactor;
}

function animate() {
  drawGround();
  if (!gameOver) requestAnimationFrame(animate);
}

function drawPlayer() {
  ctx.drawImage(curImg, pX, pY, pW, pH);
}

function runAnimation(timestamp) {
  if (timestamp - lastToggleTime > toggleSpeed) {
    curImg = curImg === img1 ? img2 : img1;
    lastToggleTime = timestamp;
  }
  drawPlayer();
  if (!gameOver) {
    jump();
    requestAnimationFrame(runAnimation);
  }
}

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !jumpInProgress && !falling) {
    jumpInProgress = true;
    doneIncrement = false;
  }
});

function jump() {
  if (!gameOver) {
    if (jumpInProgress) {
      if (pY >= canvas.height - maxHeight) pY -= jumpSpeed * pY;
      else {
        jumpInProgress = false;
        falling = true;
      }
    } else if (falling) {
      if (pY <= 80) pY += gravity * pY;
      else {
        pY = 80;
        falling = false;
      }
    }
  }
}

function cactusLoop(timestamp) {
  if (cactArr.length === 0 || timestamp - lastCactusTime > cactusTimeGap) {
    generateCatus();
    lastCactusTime = timestamp;
    cactusTimeGap = Math.floor(Math.random() * 600) + 1500;
  }
  for (let i = cactArr.length - 1; i >= 0; i--) {
    let cactus = cactArr[i];
    if (!gameOver) cactus.x -= dx;
    ctx.drawImage(
      cactus.image,
      cactus.x,
      cactus.y,
      cactus.width,
      cactus.height
    );

    if (cactus.x + cactus.width < 0) {
      cactArr.splice(i, 1);
    }
    if (
      pX * 0.6 < cactus.x + cactus.width &&
      pX * 0.6 + pW > cactus.x &&
      pY * 0.7 < cactus.y + cactus.height &&
      pY * 0.7 + pH > cactus.y
    ) {
      gameOver = true;
      call++;
      if (call == 1) {
        let div = document.createElement("div");
        let button = document.createElement("button");
        div.classList.add("text");
        button.classList.add("restart");
        div.innerHTML = "GAME OVER";
        button.innerHTML = "Restart";
        document.body.appendChild(div);
        document.body.appendChild(button);
        button.addEventListener("click", () => {
          location.reload();
        });
      }
    } else if (pX < cactus.x + cactus.width && pX + pW > cactus.x) {
      if (!gameOver && !doneIncrement) {
        doneIncrement = true;
        gameScore++;
        score.innerHTML = gameScore;
      }
    } 
  }
  requestAnimationFrame(cactusLoop);
}

function generateCatus() {
  let index = Math.floor(Math.random() * 3);
  let cactusImg = new Image();
  cactusImg.src = cactiConfig[index].image;
  cactArr.push({
    image: cactusImg,
    x: canvas.width * 1.2,
    y: canvas.height - cactiConfig[index].height - 22,
    width: cactiConfig[index].width,
    height: cactiConfig[index].height,
  });
}