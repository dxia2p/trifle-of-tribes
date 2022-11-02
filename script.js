let canvas = document.getElementById("canv");

let ctx = canvas.getContext("2d");

canvas.width = "854";
canvas.height = "480";
class Vector2{
    x = 0;
    y = 0;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


let cam = new Camera(854, 480, new Vector2(0, 0));
const BACKGROUNDSIZE = 2000;
let square = new RectRenderer(new Vector2(0, 0), BACKGROUNDSIZE, BACKGROUNDSIZE, "#A6E57A", cam);
let backgroundSquares = [];
const BACKGROUNDSQUARESSIZE = 30;
let offsetRow = false;
for(let y = (BACKGROUNDSIZE / 2); y > -(BACKGROUNDSIZE / 2); y -= BACKGROUNDSQUARESSIZE){
    if(!offsetRow){
        for(let x = BACKGROUNDSIZE / -2; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", cam));
        }
        offsetRow = true;
    }else{
        for(let x = (BACKGROUNDSIZE / -2) + BACKGROUNDSQUARESSIZE; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", cam));
        }
        offsetRow = false
    }

}

// Mouse movement (snap mouse to grid)
document.addEventListener('mousemove', (event) => {
	let mousePos = getMousePos(canvas, event);
    console.log(mousePos);
});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

// Camera Movement
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
let upDownValue = 0;
let leftRightValue = 0;

function keydownHandler(event) {
    if (event.code == "KeyW") {
        upDownValue = 3;
    } else if (event.code == "KeyS") {
        upDownValue = -3;
    } else if (event.code == "KeyA") {
        leftRightValue = -3;
    } else if (event.code == "KeyD") {
        leftRightValue = 3;
    }
}

function keyupHandler(event) {
    if (event.code == "KeyW" || event.code == "KeyS") {
        upDownValue = 0;
    } else if (event.code == "KeyA" || event.code == "KeyD") {
        leftRightValue = 0;
    }
}

function loop(time){
    cam.pos.y += upDownValue;
    cam.pos.x += leftRightValue;
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);