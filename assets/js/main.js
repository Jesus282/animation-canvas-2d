const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let circles = [];

// Valores iniciales
let canvasWidth = 600;
let canvasHeight = 400;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Clase Circle con efecto glass
class Circle {
  constructor(x, y, radius, text, speed, color) {
    this.radius = radius;
    this.posX = x;
    this.posY = y;
    this.text = text;
    this.speed = speed;
    this.color = color;

    this.dx = (Math.random() > 0.5 ? 1 : -1) * speed;
    this.dy = (Math.random() > 0.5 ? 1 : -1) * speed;
}

  draw(ctx) {
    ctx.beginPath();

    // Gradiente glass con color
    let gradient = ctx.createRadialGradient(
        this.posX, this.posY, this.radius * 0.2,
        this.posX, this.posY, this.radius
    );

    gradient.addColorStop(0, this.color); // centro con color
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
    let nextX = this.posX + this.dx;
    let nextY = this.posY + this.dy;

    // Rebote X
    if (nextX + this.radius > canvasWidth) {
      this.posX = canvasWidth - this.radius;
      this.dx *= -1;
    } else if (nextX - this.radius < 0) {
      this.posX = this.radius;
      this.dx *= -1;
    } else {
      this.posX = nextX;
    }

    // Rebote Y
    if (nextY + this.radius > canvasHeight) {
      this.posY = canvasHeight - this.radius;
      this.dy *= -1;
    } else if (nextY - this.radius < 0) {
      this.posY = this.radius;
      this.dy *= -1;
    } else {
      this.posY = nextY;
    }

    this.draw(ctx);
  }
}

// Generar círculos
function generateCircles(n) {
  circles = [];

  for (let i = 0; i < n; i++) {

    // Tamaño del círculo
    let radius = Math.random() * 30 + 20;

    // Posición asegurando que no salga del canvas
    let x = Math.random() * (canvasWidth - radius * 2) + radius;
    let y = Math.random() * (canvasHeight - radius * 2) + radius;

    // Velocidad
    let speed = Math.random() * 2 + 1.5;

    // Color glass aleatorio
    let hue = Math.floor(Math.random() * 360);
    let color = `hsla(${hue}, 70%, 60%, 0.55)`;

    // Crear círculo
    let circle = new Circle(
      x,
      y,
      radius,
      `C${i + 1}`, // texto dentro del círculo
      speed,
      color
    );

    circles.push(circle);
  }
}

// Botón aplicar
document.getElementById("applyBtn").addEventListener("click", () => {
  let n = parseInt(document.getElementById("numCircles").value);
  canvasWidth = parseInt(document.getElementById("canvasWidth").value);
  canvasHeight = parseInt(document.getElementById("canvasHeight").value);

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  generateCircles(n);
});

// Animación
function animate() {
  requestAnimationFrame(animate);
    // Limpia primero
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Fondo glass del canvas
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  circles.forEach(c => c.update(ctx));
}

// Inicial
generateCircles(5);
animate();