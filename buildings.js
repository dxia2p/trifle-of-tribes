class Building {
    constructor(pos, gridWidth, gridHeight, maxHealth) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
    }
}

class GoldStorage extends Building {
    constructor(pos, gridWidth, gridHeight, maxHealth, spriteRenderer) {
        super(pos, gridWidth, gridHeight, maxHealth);
        this.spriteRenderer = spriteRenderer;
    }
}

class RockThrower extends Building {
    constructor(pos, gridWidth, gridHeight, maxHealth, spriteRenderer) {
        super(pos, gridWidth, gridHeight, maxHealth);
        this.spriteRenderer = spriteRenderer;
    }

    // add logic here
}