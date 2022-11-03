let canvas = document.getElementById("canv");
document.getElementById("goldTest").addEventListener("click", goldLevelIncrease);

let ctx = canvas.getContext("2d");

canvas.width = "854";
canvas.height = "480";
class Vector2 {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


let cam = new Camera(854, 480, new Vector2(0, 0));
const BACKGROUND_SIZE = 1980;
let square = new RectRenderer(new Vector2(0, 0), BACKGROUND_SIZE, BACKGROUND_SIZE, "#A6E57A", 1, cam);
let backgroundSquares = [];
const BACKGROUND_SQUARES_SIZE = 30;
let offsetRow = false;
for (let y = (BACKGROUND_SIZE / 2); y > -(BACKGROUND_SIZE / 2); y -= BACKGROUND_SQUARES_SIZE) {
    if (!offsetRow) {
        for (let x = BACKGROUND_SIZE / -2; x < BACKGROUND_SIZE / 2; x += BACKGROUND_SQUARES_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y),
                BACKGROUND_SQUARES_SIZE, BACKGROUND_SQUARES_SIZE, "#78D03B", 1, cam));
        }
        offsetRow = true;
    } else {
        for (let x = (BACKGROUND_SIZE / -2) + BACKGROUND_SQUARES_SIZE; x < BACKGROUND_SIZE / 2; x += BACKGROUND_SQUARES_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y),
                BACKGROUND_SQUARES_SIZE, BACKGROUND_SQUARES_SIZE, "#78D03B", 1, cam));
        }
        offsetRow = false;
    }
}

// Mouse movement (snap mouse to grid)
let mouseRect = new RectRenderer(new Vector2(0, 0), BACKGROUND_SQUARES_SIZE, BACKGROUND_SQUARES_SIZE, "#FFFFFF", 0.7, cam);
document.addEventListener('mousemove', (event) => {
    let mousePos = getMousePos(canvas, event);
    mouseRect.pos.x = Math.round((mousePos.x + cam.pos.x) / 30) * 30;
    mouseRect.pos.y = Math.round((mousePos.y - cam.pos.y) / 30) * 30;
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

// Main Game Loop
function loop(time) {
    cam.pos.y += upDownValue;
    cam.pos.x += leftRightValue;
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Gold Counter
let gold = 0;
function goldLevelIncrease() {
    let goldLevel = 1;
    goldLevel + 1;
    let goldInterval = 600 * 1 / goldLevel;
    console.log(goldLevel);

    window.setInterval(
        () => {
            gold++;
            console.log(gold);
        },
        goldInterval);
}