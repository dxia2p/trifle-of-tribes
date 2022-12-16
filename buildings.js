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

        this.healthBar = new HealthBar(new Vector2(this.pos.x, this.pos.y), this.spriteRenderer.width - 5, 10, "green");
        this.healthBar.offset.y = 32;

        this.cornerPoints = [
            new Vector2(this.pos.x - (this.gridWidth * GRID_SIZE / 2), this.pos.y + (this.gridHeight * GRID_SIZE / 2)),
            new Vector2(this.pos.x + (this.gridWidth * GRID_SIZE / 2), this.pos.y + (this.gridHeight * GRID_SIZE / 2)),
            new Vector2(this.pos.x + (this.gridWidth * GRID_SIZE / 2), this.pos.y - (this.gridHeight * GRID_SIZE / 2)),
            new Vector2(this.pos.x - (this.gridWidth * GRID_SIZE / 2), this.pos.y - (this.gridHeight * GRID_SIZE / 2)),
        ];

        placedBuildings.push(this);
    }

    takeDamage(damage) {
        this.health -= damage;
        if(this.health <= 0){
            this.die();
        }
        this.healthBar.takeDamage(this.maxHealth, this.health);
    }

    die() {

    }

    update(time) {
        this.healthBar.healthBarUpdate(this.pos);
    }
}

class GoldStorage extends Building {
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 500;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, goldStorageImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(time) {
        super.update(time);
    }
}

class RockThrower extends Building {
    maxTimeBtwAttack = 1;
    timeBtwAttack = 1;
    range = 200;
    projectileSpeed = 400;
    damage = 50;
    constructor(pos) {
        let maxHealth = 200;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, rockThrowerImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);

    }

    update(time) {
        super.update(time);
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

    attack(closestEnemyPos) {
        let direction = new Vector2(closestEnemyPos.x - this.pos.x, closestEnemyPos.y - this.pos.y).unit();

        let p = new Projectile(new Vector2(this.pos.x, this.pos.y), direction, this.projectileSpeed, this.damage, 20, rockImg);
        p.rotate = true;
        p.pierce = true;
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
    maxTimeBtwAttack = 0.5;
    timeBtwAttack = 0.5;
    range = 350;
    projectileSpeed = 900;
    damage = 30;
    constructor(pos) {
        let maxHealth = 150;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, bowmanImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(time) {
        super.update(time);
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

    attack(closestEnemyPos) {
        let direction = new Vector2(closestEnemyPos.x - this.pos.x, closestEnemyPos.y - this.pos.y);
        let m = direction.magnitude();
        direction.x /= m;
        direction.y /= m; // make the direction on the unit circle by dividing it by its magnitude
        let p = new Projectile(new Vector2(this.pos.x, this.pos.y), direction, this.projectileSpeed, this.damage, 15, arrowImg);
        // for fun remove later
        let angle = Math.atan2(direction.y, direction.x);
        angle += 0.2
        let a = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle -= 0.4;
        let ab = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle += 0.6;
        let abc = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle -= 0.8;
        let abd = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle += 1
        let abcd = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle -= 1.2;
        let abdas = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle += 1.4;
        let abcw = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
        angle -= 1.6;
        let abda = new Projectile(new Vector2(this.pos.x, this.pos.y), new Vector2(Math.cos(angle), Math.sin(angle)), this.projectileSpeed, this.damage, 15, arrowImg);
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
    lifetime = 1;
    rotate = false;
    pierce = false;
    destroySelf = false;
    constructor(pos, direction, speed, damage, collisionRadius, img) {
        this.pos = pos;
        this.direction = direction;

        this.speed = speed;
        this.damage = damage;
        this.collisionRadius = collisionRadius;
        this.spriteRenderer = new SpriteRenderer(pos, 60, 60, 1, img, cam);
        this.spriteRenderer.rotation = Math.PI - Math.atan2(this.direction.y, this.direction.x);
        projectiles.push(this);
    }

    update(time) {
        if (this.lifetime <= 0 || this.destroySelf) {
            this.destroy();

        } else {
            this.lifetime -= time;
            if (this.rotate) {
                this.spriteRenderer.rotation += 0.04;
            }

            this.pos.x += this.direction.x * this.speed * time;
            this.pos.y += this.direction.y * this.speed * time;
        }
    }

    destroy() {
        this.spriteRenderer.removeFromDrawList();
        this.spriteRenderer = null;
        projectiles.splice(projectiles.indexOf(this), 1);
    }

    onCollision() {

        if (!this.pierce) {
            this.destroySelf = true;
        }


    }
}

function checkCollisionBetweenProjectilesAndEnemies() {
    for (let i = 0; i < projectiles.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (circleCollision(projectiles[i].pos, projectiles[i].collisionRadius,
                enemies[j].pos, enemies[j].collisionRadius)) {
                enemies[j].takeDamage(projectiles[i].damage, projectiles[i]);
                projectiles[i].onCollision();

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