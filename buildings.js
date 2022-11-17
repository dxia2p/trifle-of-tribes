let placedBuildings = [];

function updateAllBuildings(){
    for(let i = 0; i < placedBuildings.length; i++){
        placedBuildings[i].update();
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
        let sr = new SpriteRenderer(new Vector2(0, 0), 90, 90, 1, goldStorageImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class RockThrower extends Building {

    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 200;
        let sr = new SpriteRenderer(pos, BACKGROUND_SQUARES_SIZE * gridWidth, BACKGROUND_SQUARES_SIZE * gridHeight, 1, rockThrowerImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(){
        //throw projectile
    }
}