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
    timeBtwAttack = 1;
    range = 200;
    projectileSpeed = 500;
    damage = 50;
    constructor(pos) {
        let maxHealth = 200;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, rockThrowerImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(time) {
        if (this.timeBtwAttack <= 0) {
            let closestEnemyData = getClosestEnemy(this.pos); // returns closestDist and closestEnemy
            if (closestEnemyData.closestDist < this.range) {
                this.timeBtwAttack = this.maxTimeBtwAttack;
                this.attack(new Vector2(closestEnemyData.closestEnemy.pos.x, closestEnemyData.closestEnemy.pos.y));
            }
        } else {
            this.timeBtwAttack -= time;
        }
    }

    attack(closestEnemyPos) { // BUG: ROCKMAN THROWS ROCK ONCE AFTER GOBLIN DIES
        let direction = new Vector2(closestEnemyPos.x - this.pos.x, closestEnemyPos.y - this.pos.y);
        let m = direction.magnitude();
        direction.x /= m;
        direction.y /= m; // make the direction on the unit circle by dividing it by its magnitude
        let p = new Projectile(new Vector2(this.pos.x, this.pos.y), direction, this.projectileSpeed, this.damage, 20, rockImg);

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
function updateAllProjectiles(changeInTime) {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update(changeInTime);
    }
}

class Projectile {
    lifetime = 2;
    constructor(pos, direction, speed, damage, collisionRadius, img) {
        this.pos = pos;
        this.direction = direction;
        this.speed = speed;
        this.damage = damage;
        this.collisionRadius = collisionRadius;
        this.spriteRenderer = new SpriteRenderer(pos, 60, 60, 1, img, cam);
        projectiles.push(this);
    }

    update(time) {
        if (this.lifetime <= 0) {
            this.spriteRenderer.removeFromDrawList();
            this.spriteRenderer = null;
            projectiles.splice(projectiles.indexOf(this), 1);

        } else {
            this.lifetime -= time;
            this.spriteRenderer.rotation += 0.04;
            this.pos.x += this.direction.x * this.speed * time;
            this.pos.y += this.direction.y * this.speed * time;
        }
    }

    onCollision() {

    }
}

function checkCollisionBetweenProjectilesAndEnemies() {
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (circleCollision(projectiles[i].pos, projectiles[i].collisionRadius,
                enemies[j].pos, enemies[j].collisionRadius)) {
                projectiles[i].onCollision();
                enemies[j].takeDamage(projectiles[i].damage, projectiles[i]);
            }
        }
    }
}

function circleCollision(pos1, radius1, pos2, radius2) {
    let dist = Math.sqrt(Math.abs(pos2.x - pos1.x) ** 2 + Math.abs(pos2.y - pos1.y) ** 2);
    if (dist <= radius1 + radius2) {
        return true;
    }
    return false;
}
