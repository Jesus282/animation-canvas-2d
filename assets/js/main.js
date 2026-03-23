const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let circles = [];
let currentEffect = "normal";

// =========================
// CLASE
// =========================
class Circle {
  constructor(x, y, radius, text, speed, color) {
    this.radius = radius;
    this.posX = x;
    this.posY = y;
    this.text = text;
    this.speed = speed;
    this.color = color;

    this.dx = 0;
    this.dy = 0;

    this.friction = 0.98;
    this.gravity = 0.3;
  }

  draw(ctx) {
    ctx.beginPath();

    let gradient = ctx.createRadialGradient(
      this.posX, this.posY, this.radius * 0.2,
      this.posX, this.posY, this.radius
    );

    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "rgba(255,255,255,0.1)");

    ctx.fillStyle = gradient;
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;

    ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.posX, this.posY);

    ctx.closePath();
  }

  update(ctx) {

    // gravedad solo en ciertos modos
    if (currentEffect === "up" || currentEffect === "bounce" || currentEffect === "superbounce") {
      this.dy += this.gravity;
    }

    let nextX = this.posX + this.dx;
    let nextY = this.posY + this.dy;

    // rebote X
    if (nextX + this.radius > canvasWidth) {
      this.posX = canvasWidth - this.radius;
      this.dx *= -this.friction;
    } else if (nextX - this.radius < 0) {
      this.posX = this.radius;
      this.dx *= -this.friction;
    } else {
      this.posX = nextX;
    }

    // rebote Y
    if (nextY + this.radius > canvasHeight) {
      this.posY = canvasHeight - this.radius;
      this.dy *= -this.friction;

      if (Math.abs(this.dy) < 0.5) this.dy = 0;

    } else if (nextY - this.radius < 0) {
      this.posY = this.radius;
      this.dy *= -this.friction;
    } else {
      this.posY = nextY;
    }

    // fricción horizontal
    this.dx *= this.friction;

    this.draw(ctx);
  }
}

// =========================
// GENERAR
// =========================
function generateCircles(n) {
  circles = [];

  for (let i = 0; i < n; i++) {

    let radius = Math.random() * 25 + 15;
    let speed = Math.random() * 4 + 2;
    let color = `hsla(${Math.random() * 360}, 70%, 60%, 0.6)`;

    let x, y, dx, dy;

    switch (currentEffect) {

      // 🚀 DESDE ABAJO (MEJORADO)
      case "up":
        x = Math.random() * (canvasWidth - 2 * radius) + radius;
        y = canvasHeight - radius;

        dx = (Math.random() - 0.5) * 8; // dispersión fuerte
        dy = -Math.random() * 15 - 5;   // impulso potente
        break;

      // ☄️ ASTEROIDES
      case "asteroids":
        x = Math.random() * canvasWidth;
        y = Math.random() * canvasHeight;

        dx = (Math.random() - 0.5) * 3;
        dy = (Math.random() - 0.5) * 3;
        break;

      // 💥 SUPER REBOTE
      case "superbounce":
        x = Math.random() * (canvasWidth - 2 * radius) + radius;
        y = Math.random() * (canvasHeight - 2 * radius) + radius;

        dx = (Math.random() - 0.5) * 12;
        dy = (Math.random() - 0.5) * 12;
        break;

      // NORMAL
      default:
        x = Math.random() * (canvasWidth - 2 * radius) + radius;
        y = Math.random() * (canvasHeight - 2 * radius) + radius;

        dx = (Math.random() - 0.5) * speed * 2;
        dy = (Math.random() - 0.5) * speed * 2;
        break;
    }

    let circle = new Circle(x, y, radius, i + 1, speed, color);

    // Ajustes especiales por efecto
    if (currentEffect === "asteroids") {
      circle.friction = 1;   // sin pérdida
      circle.gravity = 0;    // sin gravedad
    }

    if (currentEffect === "superbounce") {
      circle.friction = 0.995; // casi no pierde energía
      circle.gravity = 0.4;
    }

    circle.dx = dx;
    circle.dy = dy;

    circles.push(circle);
  }
}

// =========================
// EVENTO
// =========================
document.getElementById("applyBtn").addEventListener("click", () => {

  let n = parseInt(document.getElementById("numCircles").value);
  canvasWidth = parseInt(document.getElementById("canvasWidth").value);
  canvasHeight = parseInt(document.getElementById("canvasHeight").value);
  currentEffect = document.getElementById("effect").value;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  generateCircles(n);
});

// =========================
// ANIMACIÓN
// =========================
function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  circles.forEach(c => c.update(ctx));
}

// Inicio
generateCircles(5);
animate();