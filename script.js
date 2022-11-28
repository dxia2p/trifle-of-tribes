let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");
canvas.width = "854";
canvas.height = "480";

// Add HTML Elements (Buttons)
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

// Draw Background
let cam = new Camera(854, 480, new Vector2(0, 0));
let square = new RectRenderer(new Vector2(0, 0), BACKGROUND_SIZE, BACKGROUND_SIZE, "#A6E57A", 1, cam);
let backgroundSquares = [];
let offsetRow = false;

for (let y = (BACKGROUND_SIZE / 2); y > -(BACKGROUND_SIZE / 2); y -= GRID_SIZE) {
    if (!offsetRow) {
        for (let x = BACKGROUND_SIZE / -2; x < BACKGROUND_SIZE / 2; x += GRID_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y),
                GRID_SIZE, GRID_SIZE, "#78D03B", 1, cam));
        }
        offsetRow = true;
    } else {
        for (let x = (BACKGROUND_SIZE / -2) + GRID_SIZE; x < BACKGROUND_SIZE / 2; x += GRID_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y),
                GRID_SIZE, GRID_SIZE, "#78D03B", 1, cam));
        }
        offsetRow = false;
    }
}

// Mouse Movement Event (snap mouse to grid)
let mouseRect = new RectRenderer(new Vector2(0, 0), GRID_SIZE, GRID_SIZE, "#FFFFFF", 0.7, cam);
document.addEventListener('mousemove', (event) => {
    let mousePos = getMousePos(canvas, event);
    drawBuildingTemplate(mousePos);
    setMouseRectPos(mousePos);
});

function setMouseRectPos(mp) {
    mouseRect.pos.x = Math.round((mp.x + cam.pos.x) / 30) * 30;
    mouseRect.pos.y = Math.round((mp.y - cam.pos.y) / 30) * 30;
}

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
let prevTime = 0;
let changeInTime = 0;
function loop(time) {
    changeInTime = time - prevTime;
    cam.pos.y += upDownValue;
    cam.pos.x += leftRightValue;

    updateAllBuildings(changeInTime);


    drawAll(ctx);
    prevTime = time;
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Gold
function goldLevelIncrease() {
    goldStorageCost *= 3;
    console.log(goldStorageCost);
    goldLevel *= 2;
    console.log(goldLevel);
    document.getElementById("upgradeCost").innerHTML = goldStorageCost;
}

window.setInterval(() => {
    gold += goldLevel;
    document.getElementById("goldAmount").innerHTML = gold;
}, 600);

// Select Building
let buildings = [];
let selectedBuilding = 0;
let buildingTemplates = [
    new BuildingTemplate(new Vector2(0, 0), 2, 2, rockThrowerImg, cam)
];

function selectBuilding(buildingType) {
    if (buildingType === selectedBuilding) {
        selectedBuilding = 0;
        return;
    }
    selectedBuilding = buildingType;
}

// Add Event Listeners
goldTestEl.addEventListener("click", () => {
    // Upgrade Gold Storage, Deduct Gold
    if (gold >= goldStorageCost) {
        gold -= goldStorageCost;

        goldLevelIncrease();
    }
});

buildingBtn1.addEventListener("click", () => { selectBuilding(1) });
buildingBtn2.addEventListener("click", () => { selectBuilding(2) });
buildingBtn3.addEventListener("click", () => { selectBuilding(3) });
buildingBtn4.addEventListener("click", () => { selectBuilding(4) });
buildingBtn5.addEventListener("click", () => { selectBuilding(5) });

// Place Gold Storage
let goldStorage = new GoldStorage(new Vector2(0 + 15, 0 + 15), 4, 4);

function drawBuildingTemplate(mp) {
    console.log(selectedBuilding);
    if (selectedBuilding === 0) {
        return;
    }
    let bt = buildingTemplates[selectedBuilding - 1];
    bt.pos.x = Math.round((mp.x + cam.pos.x) / 30) * 30;
    bt.pos.y = Math.round((mp.y - cam.pos.y) / 30) * 30;
    if (bt.gridWidth % 2 == 0) { // OFFSET IT BY HALF THE GRID SIZE IF THE WIDTH IS EVEN
        bt.pos.x -= GRID_SIZE / 2;
    }
    if (bt.gridHeight % 2 == 0) { // DO THE SAME FOR THE HEIGHT
        bt.pos.y -= GRID_SIZE / 2;
    }
}

// Place building
document.addEventListener('mousedown', (event) => {
    let mousePos = getMousePos(canvas, event); // get mouse pos function defined in mouse movement section
    // Place Building Here
    for (let i = 0; i < placedBuildings.length; i++) {

    }
});

// Wall
let wall = new Wall(new Vector2(0, 90), 1, 1);
let wall1 = new Wall(new Vector2(30, 90), 1, 1);
let wall2 = new Wall(new Vector2(60, 90), 1, 1);
let wall3 = new Wall(new Vector2(-30, 90), 1, 1);
let wall4 = new Wall(new Vector2(-60, 90), 1, 1);
let wall5 = new Wall(new Vector2(-60, 60), 1, 1);
let wall6 = new Wall(new Vector2(-60, 30), 1, 1);
let wall7 = new Wall(new Vector2(-60, 0), 1, 1);
let spearman1 = new Spearman(new Vector2(-105,15), 2, 2);
let bowman1 = new Bowman(new Vector2(-105, 195), 2, 2)
let mageman1 = new Mageman(new Vector2(-105, 105), 2, 2)

// temp
let rockThrower = new RockThrower(new Vector2(90 + 15, 90 + 15), 2, 2);