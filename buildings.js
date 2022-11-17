class Building {
    constructor(pos, gridWidth, gridHeight, maxHealth, spriteRenderer) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.spriteRenderer = spriteRenderer;
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
        let sr = new SpriteRenderer(new Vector2(120 + 15, 0 + 15), 60, 60, 1, rockThrowerImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    // add logic here
}