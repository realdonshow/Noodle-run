const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gravity = 0.6;
let score = 0;
let invincible = false;
let doublePoints = false;

const player = {
  x: 50,
  y: 300,
  width: 80,
  height: 160,
  dy: 0,
  jump: -12,
  grounded: false,
  img: new Image()
};

player.img.src = "character_sprite_8bit.png";

class Item {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.type = type;
    this.img = new Image();
    this.img.src = {
      noodle: "noodle_sprite_8bit.png",
      star: "noodle_sprite_8bit.png",
      mushroom: "noodle_sprite_8bit.png"
    }[type];
  }

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.size, this.size);
  }

  update() {
    this.x -= 5;
    this.draw();
  }
}

let items = [];

function spawnItem() {
  const types = ["noodle", "star", "mushroom"];
  const type = types[Math.floor(Math.random() * 10) < 7 ? 0 : Math.floor(Math.random() * 3)];
  items.push(new Item(canvas.width + 30, Math.random() * 300 + 50, type));
}

function drawPlayer() {
  ctx.drawImage(player.img, player.x, player.y, player.width, player.height);
}

function updatePlayer() {
  player.dy += gravity;
  player.y += player.dy;
  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height;
    player.dy = 0;
    player.grounded = true;
  }
}

function checkCollision(item) {
  return (
    player.x < item.x + item.size &&
    player.x + player.width > item.x &&
    player.y < item.y + item.size &&
    player.y + player.height > item.y
  );
}

function handlePowerUp(type) {
  if (type === "star") {
    invincible = true;
    setTimeout(() => (invincible = false), 5000);
  } else if (type === "mushroom") {
    doublePoints = true;
    setTimeout(() => (doublePoints = false), 10000);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  drawPlayer();

  items.forEach((item, index) => {
    item.update();
    if (checkCollision(item)) {
      if (item.type === "noodle") {
        score += doublePoints ? 2 : 1;
      } else {
        handlePowerUp(item.type);
      }
      items.splice(index, 1);
    }
  });

  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 25);

  requestAnimationFrame(gameLoop);
}

setInterval(spawnItem, 1500);

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
  }
});

document.getElementById("jumpBtn").addEventListener("touchstart", () => {
  if (player.grounded) {
    player.dy = player.jump;
    player.grounded = false;
  }
});

player.img.onload = () => {
  gameLoop();
};