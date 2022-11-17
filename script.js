let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");
canvas.width = "854";
canvas.height = "480";

// Add HTML Elements
let goldTestEl = document.getElementById("goldTest");
let buildingBtn1 = document.getElementById("building-btn-1");
let buildingBtn2 = document.getElementById("building-btn-2");
let buildingBtn3 = document.getElementById("building-btn-3");
let buildingBtn4 = document.getElementById("building-btn-4");
let buildingBtn5 = document.getElementById("building-btn-5");



// Gold Variables
let gold = 0;
var goldLevel = 1;
let goldStorageCost = 30;

// Add Event Listeners
goldTestEl.addEventListener("click", () => {
if (gold >= goldStorageCost) {
    gold -= goldStorageCost;
    goldLevelIncrease();
}
});


class Vector2 {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// draw background
let cam = new Camera(854, 480, new Vector2(0, 0));

let square = new RectRenderer(new Vector2(0, 0), BACKGROUND_SIZE, BACKGROUND_SIZE, "#A6E57A", 1, cam);
let backgroundSquares = [];

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

// Main Game Loop--------------------------------------------------------
function loop(time) {
    cam.pos.y += upDownValue;
    cam.pos.x += leftRightValue;
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Gold
function goldLevelIncrease() {
    goldStorageCost *= 3;
    console.log(goldStorageCost);
    goldLevel *= 2;
    console.log(goldLevel);
}

window.setInterval(() => {
    gold += goldLevel;
    document.getElementById("goldAmount").innerHTML = gold;
}, 600);

// Select Building

let buildings = [];
let selectedBuilding;

function selectBuilding(buildingType) {
    if (buildingType == 1) {
        selectedBuilding = 1;
    } else if (buildingType == 2) {
        selectedBuilding = 2;
    } else if (buildingType == 3) {
        selectedBuilding = 3;
    } else if (buildingType == 4) {
        selectedBuilding = 4;
    } else if (buildingType == 5) {
        selectedBuilding = 5;
    }
}

buildingBtn1.addEventListener("click", selectBuilding(1));
buildingBtn2.addEventListener("click", selectBuilding(2));
buildingBtn3.addEventListener("click", selectBuilding(3));
buildingBtn4.addEventListener("click", selectBuilding(4));
buildingBtn5.addEventListener("click", selectBuilding(5));

// place gold storage


let goldStorage = new GoldStorage(new Vector2(0, 0), 3, 3);

// Place building
document.addEventListener('mousedown', (event) => {
    let mousePos = getMousePos(canvas, event); // get mouse pos function defined in mouse movement section
    // place building here
});

// temp
