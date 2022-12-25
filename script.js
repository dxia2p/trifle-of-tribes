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
];

// Gold Variables
let gold = 50;
var goldLevel = 1;
let goldStorageCost = 50;
let spearmanCost = 25;
let bowmanCost = 35;
let rockmanCost = 50;
let magemanCost = 60;
let wallCost = 10;

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
let mousePos = new Vector2(0, 0);
document.addEventListener('mousemove', (event) => {
    mousePos = getMousePos(canvas, event);
    //drawBuildingTemplate(mousePos);
    //setMouseRectPos(mousePos);
});

function setMouseRectPos(mp) {
    mouseRect.pos.x = Math.round((mp.x + cam.pos.x) / 30) * 30;
    mouseRect.pos.y = -Math.round((mp.y - cam.pos.y) / 30) * 30; // reversed because if not selecting square is broken
}

function getMousePos(cnv, evt) {
    var rect = cnv.getBoundingClientRect();
    return new Vector2((evt.clientX - rect.left) - cnv.width / 2, (evt.clientY - rect.top) - cnv.height / 2);

}

// Camera Movement
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
let upDownValue = 0;
let leftRightValue = 0;

function keydownHandler(event) {
    if (event.code === "KeyW") {
        upDownValue = 3;
    } else if (event.code === "KeyS") {
        upDownValue = -3;
    } else if (event.code === "KeyA") {
        leftRightValue = -3;
    } else if (event.code === "KeyD") {
        leftRightValue = 3;
    } else if (event.code === "Backspace") {
        deleteBuilding();
    } else if (event.code === "KeyR") {
        repairBuilding();
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
let gameOver = false;
gold += 10000; // temp
function loop(time) {
    changeInTime = (time - prevTime) / 1000;
    cam.pos.y += upDownValue;
    cam.pos.x += leftRightValue;

    setMouseRectPos(mousePos);
    drawBuildingTemplate(mousePos);
    canvas.width = 0.7 * window.innerWidth;
    canvas.height = 0.6 * window.innerHeight;
    cam.width = canvas.width;
    cam.height = canvas.height;
    cam.update(changeInTime);

    updateAllBuildings(changeInTime);
    updateAllProjectiles(changeInTime);
    updateAllEnemies(changeInTime);
    updateAllParticleSystems(changeInTime);

    checkCollisionBetweenProjectilesAndEnemies();
    if (!checkGameOver()) {
        drawAll(ctx);
        prevTime = time;
        requestAnimationFrame(loop);
    }
}
requestAnimationFrame(loop);

// Gold
function goldLevelIncrease() {
    goldStorageCost *= 4;
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
let buildingTemplates = [ // transparent previews for the buildings
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, rockThrowerImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, spearmanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, bowmanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 2, 2, magemanImg, cam),
    new BuildingTemplate(new Vector2(1200, 1200), 1, 1, wallImg, cam)
];

function selectBuilding(buildingType) {
    if (selectedBuilding !== -1) {
        buildingTemplates[selectedBuilding].pos.x = 10000; // set the building template's position to somewhere far away so it doesn't show up
    }
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
    buildingBtnArray[i].addEventListener("click", () => {
        selectBuilding(i)
    })
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

function deleteBuilding() {
    if (mousePos.x < -canvas.width / 2 || mousePos.x > canvas.width / 2 || mousePos.y > canvas.height / 2 || mousePos.y < -canvas.height / 2) {
        return;
    }
    for (let i = 0; i < placedBuildings.length; i++) {
        if (rectangleOverlap(mouseRect.pos, mouseRect.width, mouseRect.height, placedBuildings[i].pos, placedBuildings[i].gridWidth * GRID_SIZE, placedBuildings[i].gridHeight * GRID_SIZE)) {
            placedBuildings[i].die();
        }
    }
}

function repairBuilding() {
    if (mousePos.x < -canvas.width / 2 || mousePos.x > canvas.width / 2 || mousePos.y > canvas.height / 2 || mousePos.y < -canvas.height / 2) {
        return;
    }
    for (let i = 0; i < placedBuildings.length; i++) {
        if (rectangleOverlap(mouseRect.pos, mouseRect.width, mouseRect.height, placedBuildings[i].pos, placedBuildings[i].gridWidth * GRID_SIZE, placedBuildings[i].gridHeight * GRID_SIZE)) {
            let pb = placedBuildings[i];
            if (pb.buildingType === -1) {
                break;
            }
            let goldCost = Math.floor((1 - (pb.health / pb.maxHealth)) * costsArray[pb.buildingType]);
            if (goldCost <= gold) {
                pb.repairToMax();
                gold -= goldCost;
                console.log("Repair Successful!");
            } else {
                console.log("Not Enough Gold to Repair!");
            }
        }
    }
}

setInterval(spawnGoblin, 6000);

function spawnGoblin() {
    let randAngle = 2 * Math.PI * Math.random();
    let coords = new Vector2(Math.cos(randAngle) * 1000, Math.sin(randAngle) * 1000);
    new Goblin(coords);
}


function spawnOrc() {
    let randAngle = 2 * Math.PI * Math.random();
    let coords = new Vector2(Math.cos(randAngle) * 500, Math.sin(randAngle) * 500);
    new Orc(coords);
}


function spawnTroll() {
    let randAngle = 2 * Math.PI * Math.random();
    let coords = new Vector2(Math.cos(randAngle) * 500, Math.sin(randAngle) * 500);
    new Troll(coords);
}


function spawnDragon() {
    let randAngle = 2 * Math.PI * Math.random();
    let coords = new Vector2(Math.cos(randAngle) * 500, Math.sin(randAngle) * 500);
    new Dragon(coords);
}

let goblinAmount = 6,
    trollAmount = 3,
    orcAmount = 2,
    dragonAmount = 1;
let waveNumber = 0;

function spawnWave() {
    waveNumber++
    console.log(waveNumber);
    if (waveNumber >= 0) {
        for (let n = 0; n < goblinAmount; n++) {
            spawnGoblin();
        }
        goblinAmount += 6;
    }
    if (waveNumber >= 6) {
        for (let n = 0; n < trollAmount; n++) {
            spawnTroll();
        }
        trollAmount += 3;
    }
    if (waveNumber >= 12) {
        for (let n = 0; n < orcAmount; n++) {
            spawnOrc();
        }
        orcAmount += 2;
    }
    if (waveNumber >= 18) {
        for (let n = 0; n < dragonAmount; n++) {
            spawnDragon();
        }
        dragonAmount += 1;
    }
    document.getElementById("waveNumberIndicator").innerHTML = waveNumber;
}

setInterval(spawnWave, 20000);

function checkGameOver() {
    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "red";
        ctx.font = "48px Times New Roman";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
        return true;
    } else {
        return false;
    }
}