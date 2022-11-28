let placedBuildings = [];

function updateAllBuildings(time){
    for(let i = 0; i < placedBuildings.length; i++){
        placedBuildings[i].update(time);
    }
}

class BuildingTemplate{
    constructor(pos, gridWidth, gridHeight, img, cam){
        this.pos = pos;
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.spriteRenderer = new SpriteRenderer(this.pos, this.gridWidth * GRID_SIZE,
            this.gridHeight * GRID_SIZE, 0.7, img, cam);
    }
}

class Building {
    constructor(pos, gridWidth, gridHeight, maxHealth, spriteRenderer) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.spriteRenderer = spriteRenderer;

        placedBuildings.push(this);
    }

    update(){

    }
}

class GoldStorage extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 500;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, goldStorageImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class RockThrower extends Building {
    maxTimeBtwThrow = 0.5;
    timeBtwThrow = 0;
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 200;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, rockThrowerImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Wall extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 300;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, wallImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Spearman extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 250;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, spearmanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Bowman extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 150;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, bowmanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Mageman extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 150;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, magemanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}