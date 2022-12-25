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
        if (this.health <= 0) {
            this.die();
        }
        this.healthBar.takeDamage(this.maxHealth, this.health);
    }

    repairToMax() {
        this.health = this.maxHealth;
        this.healthBar.takeDamage(this.maxHealth, this.health);
    }

    die() {
        cam.cameraShake(3, 0.02, 0.2);
        let buildingIndex = placedBuildings.indexOf(this)
        this.spriteRenderer.removeFromDrawList();
        this.spriteRenderer = null;
        this.healthBar.destroy();
        placedBuildings.splice(buildingIndex, 1);
        let ps = new ParticleSystem(this.pos, new SpriteRenderer(new Vector2(0, 0), 10, 10, 1, coinImg, cam), 30, 100, 0.6, true);
        ps.gravity = -3;
        ps.play();
        for(let i = 0; i < ps.particles.length; i++){ // add random lifetime and random pos to particles
            ps.particles[i].lifetime = randomRange(0.1, 0.5);
            ps.particles[i].renderer.pos.x += randomRange(-8, 8);
            ps.particles[i].renderer.pos.y += randomRange(-8, 8);
        }
    }

    update(time) {
        this.healthBar.healthBarUpdate(this.pos);
    }
}

class GoldStorage extends Building {
    buildingType = -1;
    constructor(pos, gridWidth, gridHeight) {
        let maxHealth = 500;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, goldStorageImg, cam);
        super(pos, gridWidth, gridHeight, maxHealth, sr);
    }

    update(time) {
        super.update(time);
    }

    die() {
        // Do Game Over Stuff
        console.log("Game Over");
        gameOver = true;
        super.die();
    }
}

class RockThrower extends Building {
    buildingType = 0;
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



class Spearman extends Building {
    buidlingType = 1;
    maxTimeBtwAttack = 0.8;
    timeBtwAttack = 0.8;
    range = 70;
    projectileSpeed = 900;
    damage = 120;
    lifetime = 0.1;
    constructor(pos) {
        let maxHealth = 400;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, spearmanImg, cam);

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

        let p = new Projectile(new Vector2(this.pos.x, this.pos.y), direction, this.projectileSpeed, this.damage, 20, spearImg);
        p.rotate = false;
        p.pierce = false;
    }
}

class Bowman extends Building {
    buidlingType = 2
    maxTimeBtwAttack = 0.5;
    timeBtwAttack = 0.5;
    range = 350;
    projectileSpeed = 900;
    damage = 60;
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
    }
}

class Mageman extends Building {
    buildingType = 3;
    maxTimeBtwAttack = 3;
    timeBtwAttack = 3;
    range = 200;
    projectileSpeed = 400;
    damage = 250;
    constructor(pos) {
        let maxHealth = 150;
        let gridWidth = 2;
        let gridHeight = 2;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, magemanImg, cam);
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

        let p = new Projectile(new Vector2(this.pos.x, this.pos.y), direction, this.projectileSpeed, this.damage, 20, fireballImg);
        p.rotate = false;
        p.pierce = false;
    }
}

let projectiles = [];

function updateAllProjectiles(changeInTime) {
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update(changeInTime);
    }
}

class Wall extends Building {
    buildingType = 4;
    constructor(pos) {
        let maxHealth = 300;
        let gridWidth = 1;
        let gridHeight = 1;
        let sr = new SpriteRenderer(pos, GRID_SIZE * gridWidth, GRID_SIZE * gridHeight, 1, wallImg, cam);

        super(pos, gridWidth, gridHeight, maxHealth, sr);
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