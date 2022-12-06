let canvas = document.getElementById("canv");
let ctx = canvas.getContext("2d");
canvas.width = "854";
canvas.height = "480";

// Add HTML Elements (Buttons)
let goldTestEl = document.getElementById("goldTest");
let buildingBtnArray = [
    document.getElementById("building-btn-1"),
    document.getElementById("building-btn-2"),
    document.getElementById("building-btn-3"),
    document.getElementById("building-btn-4"),
    document.getElementById("building-btn-5"),
]

// Gold Variables
let gold = 0;
var goldLevel = 1;
let goldStorageCost = 30;
let spearmanCost = 25;
let bowmanCost = 25;
let rockmanCost = 30;
let magemanCost = 40;
let wallCost = 15;

let costsArray = [
    rockmanCost,
    spearmanCost,
    bowmanCost,
    magemanCost,
    wallCost
]

// Draw Background
let cam = new Camera(854, 480, new Vector2(0, 0));
let square = new RectRenderer(new Vector2(0, 0), BACKGROUND_SIZE, BACKGROUND_SIZE, "#A6E57A", 1, cam);
let backgroundSquares = [];
let offsetRow = false;

for (let y = (BACKGROUND_SIZE / 2); y > -(BACKGROUND_SIZE / 2); y -= GRID_SIZE) {
    if (!offsetRow) {
        for (let x = BACKGROUND_SIZE / -2; x < BACKGROUND_SIZE / 2; x += GRID_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), GRID_SIZE, GRID_SIZE, "#78D03B", 1, cam));
        }
        offsetRow = true;
    } else {
        for (let x = (BACKGROUND_SIZE / -2) + GRID_SIZE; x < BACKGROUND_SIZE / 2; x += GRID_SIZE * 2) {
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), GRID_SIZE, GRID_SIZE, "#78D03B", 1, cam));
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
    goldLevel *= 2;
    document.getElementById("upgradeCost").innerHTML = goldStorageCost;
}

window.setInterval(() => {
    gold += goldLevel;
    document.getElementById("goldAmount").innerHTML = gold;

    // Check if buildings can be bought
    for (let i = 0; i < costsArray.length; i++) {
        if (gold >= costsArray[i]) {
            buildingBtnArray[i].disabled = false;
        } else {
            buildingBtnArray[i].disabled = true;
        }
    }
}, 600);

// Select Building
let buildings = [];
let selectedBuilding = -1;
let buildingTemplates = [
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, rockThrowerImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, spearmanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, bowmanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, magemanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 1, 1, wallImg, cam)
];

function selectBuilding(buildingType) {
    if (buildingType === selectedBuilding) {
        selectedBuilding = -1;
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

for (let i = 0; i < buildingBtnArray.length; i++) {
    buildingBtnArray[i].addEventListener("click", () => { selectBuilding(i) })
}

// Place Gold Storage
let goldStorage = new GoldStorage(new Vector2(0 + 15, 0 + 15), 4, 4);

function drawBuildingTemplate(mp) {
    if (selectedBuilding === -1) {
        return;
    }
    let bt = buildingTemplates[selectedBuilding];
    bt.pos.x = Math.round((mp.x + cam.pos.x) / 30) * 30;
    bt.pos.y = Math.round((mp.y - cam.pos.y) / 30) * -30;
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
    if (mousePos.x < -canvas.width / 2 || mousePos.x > canvas.width / 2 || mousePos.y > canvas.height / 2 || mousePos.y < -canvas.height / 2) {
        return;
    }
    if (selectedBuilding === -1) {
        return;
    }

    // Place Building Here
    for (let i = 0; i < placedBuildings.length; i++) {
        if (rectangleOverlap(buildingTemplates[selectedBuilding].pos, buildingTemplates[selectedBuilding].gridWidth * GRID_SIZE, buildingTemplates[selectedBuilding].gridHeight * GRID_SIZE,
            placedBuildings[i].pos, placedBuildings[i].gridWidth * GRID_SIZE, placedBuildings[i].gridHeight * GRID_SIZE)) {
            return;
        }
    }
    let b;
    switch (selectedBuilding) {
        case 0:
            if (gold >= rockmanCost) {
                gold -= rockmanCost;
                b = new RockThrower(new Vector2(buildingTemplates[selectedBuilding].pos.x, buildingTemplates[selectedBuilding].pos.y));
            } else {
                alert("NOT ENOUGH GOLD");
            }
            break;
        case 1:
            if (gold >= spearmanCost) {
                gold -= spearmanCost;
                b = new Spearman(new Vector2(buildingTemplates[selectedBuilding].pos.x, buildingTemplates[selectedBuilding].pos.y));
            } else {
                alert("NOT ENOUGH GOLD");
            }
            break;
        case 2:
            if (gold >= bowmanCost) {
                gold -= bowmanCost;
                b = new Bowman(new Vector2(buildingTemplates[selectedBuilding].pos.x, buildingTemplates[selectedBuilding].pos.y));
            } else {
                alert("NOT ENOUGH GOLD");
            }
            break;
        case 3:
            if (gold >= magemanCost) {
                gold -= magemanCost;
                b = new Mageman(new Vector2(buildingTemplates[selectedBuilding].pos.x, buildingTemplates[selectedBuilding].pos.y));
            } else {
                alert("NOT ENOUGH GOLD");
            }
            break;
        case 4:
            if (gold >= wallCost) {
                gold -= wallCost;
                b = new Wall(new Vector2(buildingTemplates[selectedBuilding].pos.x, buildingTemplates[selectedBuilding].pos.y));
            } else {
                alert("NOT ENOUGH GOLD");
            }
            break;
    }
});

function rectangleOverlap(r1center, r1width, r1height, r2center, r2width, r2height) {
    let r1TopLeft = new Vector2(r1center.x - (r1width / 2), r1center.y + (r1height / 2));
    let r1BottomRight = new Vector2(r1center.x + (r1width / 2), r1center.y - (r1height / 2));

    let r2TopLeft = new Vector2(r2center.x - (r2width / 2), r2center.y + (r2height / 2));
    let r2BottomRight = new Vector2(r2center.x + (r2width / 2), r2center.y - (r2height / 2));

    if (r1TopLeft.x >= r2BottomRight.x || r2TopLeft.x >= r1BottomRight.x)
        return false;

    if (r1BottomRight.y >= r2TopLeft.y || r2BottomRight.y >= r1TopLeft.y)
        return false;

    return true;
}