const sdl = require('@kmamal/sdl');
const Canvas = require('canvas');
const { setTimeout } = require('timers/promises');

let canvas;
let ctx;

const window = sdl.video.createWindow({ resizable: true, setVsync: false, accelerated: true });
const { pixelWidth: width, pixelHeight: height } = window;

const stride = width * 4;
const numBytes = stride * height;
const buffer = Buffer.alloc(numBytes, 0);

let tic = Date.now();
let toc;
let frames = 0;

canvas = Canvas.createCanvas(width, height);
ctx = canvas.getContext('2d');

// Ball properties
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballRadius = 20;
let dx =2;
let dy = -2;

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

async function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  // Ball movement
  if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
    dx = -dx;
  }
  if (ballY + dy > canvas.height - ballRadius || ballY + dy < ballRadius) {
    dy = -dy;
  }

  ballX += dx;
  ballY += dy;
}

async function mainLoop() {
  while (true) {
    await draw();
    console.log("lop");
    const buffer = canvas.toBuffer('raw');

    frames++;
    toc = Date.now();
    const ellapsed = (toc - tic) / 1e3;
    if (ellapsed >= 1) {
      const fps = Math.round(frames / ellapsed);

      window.setTitle(`FPS: ${fps}`);

      console.log(fps);

      tic = toc;
      frames = 0;
    }

    window.render(width, height, stride, 'rgba32', buffer);

    await new Promise(resolve => setTimeout(resolve, 0));


  }
}

setInterval(()=>{


  if(!window.destroyed){

      draw()
      const buffer = canvas.toBuffer('raw');

      frames++;
        toc = Date.now();
        const ellapsed = (toc - tic) / 1e3;
        if (ellapsed >= 1) {
          const fps = Math.round(frames / ellapsed);

          window.setTitle(`FPS: ${fps}`);

          console.log(fps);

          tic = toc;
          frames = 0;
        }
        
      window.render(width, height, stride, 'rgba32', buffer);

  }

},16);

