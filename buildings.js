let placedBuildings = [];

function updateAllBuildings(time) {
    for (let i = 0; i < placedBuildings.length; i++) {
        placedBuildings[i].update(time);
    }
}

class BuildingTemplate { // class for building preview (not actual buildings)
    constructor(pos, gridWidth, gridHeight, img, cam) {
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

    update(time) {

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
    maxTimeBtwAttack = 0.5;
    timeBtwAttack = 0.5;
    range = 200;
    constructor(pos) {
        let maxHealth = 200;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, rockThrowerImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(time) {
        let closestEnemyData = getClosestEnemy(this.pos); // returns closest dist and closest enemy
        if (closestEnemyData.closestDist > this.range) {
            return;
        }
        if (this.timeBtwAttack <= 0) {
            this.timeBtwAttack = this.maxTimeBtwAttack;
            this.attack();
        } else {
            this.timeBtwAttack -= time;
        }
    }

    attack() {
        new Projectile(this.pos, 50, 2, new SpriteRenderer(this.pos, 60, 60, 1, rockImg, cam));
    }
}

class Wall extends Building {
    constructor(pos) {
        let maxHealth = 300;
        let gridWidth = 1;
        let gridHeight = 1;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, wallImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Spearman extends Building {
    constructor(pos) {
        let maxHealth = 250;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, spearmanImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Bowman extends Building {
    constructor(pos) {
        let maxHealth = 150;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, bowmanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

class Mageman extends Building {
    constructor(pos) {
        let maxHealth = 150;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, magemanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }
}

let projectiles = [];

class Projectile {
    constructor(pos, damage, lifetime, spriteRenderer) {
        this.pos = pos;
        this.damage = damage;
        this.lifetime = lifetime;
        this.spriteRenderer = spriteRenderer;
        projectiles.push(this);
    }

    update(time) {
        if (this.lifetime <= 0) {
            this.spriteRenderer.removeFromDrawList();
            this.spriteRenderer = null;
            projectiles.splice(projectiles.indexOf(this), 1);
            
        } else {
            this.lifetime -= time;
            this.spriteRenderer.rotation += 1;
        }
    }
}