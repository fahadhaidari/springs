window.onload = function() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const numParticles = 1000;
  const gravity = 0;
  const K = 0.02;
  const maxSize = 20;
  const particles = [];
  const colors = ["orange", "white", "green", "cyan", "#FF4422", "#4488FF"];

  let t0 = performance.now();
  let isMouseDown = false

  document.body.appendChild(canvas);

  // canvas.width = window.innerWidth * 0.99;
  // canvas.height = window.innerHeight * 0.98;
  canvas.width = 600;
  canvas.height = 600;

  const mouse = { x: canvas.width / 2, y: canvas.height / 2 };

  canvas.style.marginTop = `${( (window.innerHeight / 2) - (canvas.height / 2))}px`;

  const initParticles = function(n) {
    for (let i = 0; i < n; i ++) {
      const _size = size = Math.random() * maxSize;
      const halfSize = _size * 0.5;

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: _size,
        color: colors[Math.round(Math.random() * colors.length)],
        vel: { x: 0, y: 0},
        draw: function() {
          context.beginPath();
          context.fillStyle = this.color;
          context.strokeRect(this.x, this.y, this.size, this.size);
          context.fillRect(this.x, this.y, this.size, this.size);
          context.fill();
          context.closePath();
          context.beginPath();
          context.strokeStyle = this.color;
          context.fill();
          context.moveTo(mouse.x, mouse.y);
          context.lineTo(this.x + halfSize, this.y + halfSize);
          context.stroke();
          context.closePath();
        },
        update: function(dt) {
          this.vel.x += -K * (this.x - mouse.x) * Math.random() * dt;
          this.vel.y += -K * (this.y - mouse.y) * Math.random() * dt;
          this.vel.y += gravity;
          this.vel.x *= 0.9;
          this.vel.y *= 0.9;
          this.x += this.vel.x;
          this.y += this.vel.y;
        }
      });
    }
  };

  canvas.onmousedown = function( { offsetX, offsetY } ) {
    mouse.x = offsetX; mouse.y = offsetY; isMouseDown = true;
  };

  canvas.onmousemove = function( { offsetX, offsetY } ) {
    if (isMouseDown) { mouse.x = offsetX; mouse.y = offsetY; }
  };

  canvas.onmouseup = () => { isMouseDown = false; };

  const render = function(t1) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    const dt = (t1 - t0) / 10 || 0;
    t0 = t1;

    particles.forEach(particle => { particle.update(dt); particle.draw(); });
  };

  const frame = function(t1) {
    render(t1); requestAnimationFrame(frame);
  }

  initParticles(numParticles); frame();
}
