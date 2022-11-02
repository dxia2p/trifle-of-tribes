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
const BACKGROUNDSIZE = 1980;
let square = new RectRenderer(new Vector2(0, 0), BACKGROUNDSIZE, BACKGROUNDSIZE, "#A6E57A", 1, cam);
let backgroundSquares = [];
const BACKGROUNDSQUARESSIZE = 30;
let offsetRow = false;
for(let y = (BACKGROUNDSIZE / 2); y > -(BACKGROUNDSIZE / 2); y -= BACKGROUNDSQUARESSIZE){
    if(!offsetRow){
        for(let x = BACKGROUNDSIZE / -2; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", 1, cam));
        }
        offsetRow = true;
    }else{
        for(let x = (BACKGROUNDSIZE / -2) + BACKGROUNDSQUARESSIZE; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", 1, cam));
        }
        offsetRow = false
    }

}

// Mouse movement (snap mouse to grid)
let mouseRect = new RectRenderer(new Vector2(0, 0), BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#FFFFFF", 0.7, cam);
document.addEventListener('mousemove', (event) => {
	let mousePos = getMousePos(canvas, event);
    mouseRect.pos.x = Math.round((mousePos.x + cam.pos.x) / 30) * 30;
    mouseRect.pos.y = Math.round((mousePos.y - cam.pos.y) / 30) * 30;
    console.log(mouseRect.pos);
});

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (evt.clientX - rect.left) - canvas.width / 2,
      y: (evt.clientY - rect.top) - canvas.height / 2
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