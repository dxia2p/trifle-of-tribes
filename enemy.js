let enemies = [];
function updateAllEnemies(changeInTime) {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update(changeInTime);
    }
}

function getClosestEnemy(pos) {
    let closestDistSquared = 99999999;
    let closestEnemy;
    for (let i = 0; i < enemies.length; i++) {
        let distSq = (enemies[i].pos.y - pos.y) ** 2 + (enemies[i].pos.x - pos.x) ** 2;
        if (distSq < closestDistSquared) {
            closestDistSquared = distSq;
            closestEnemy = enemies[i];
        }
    }
    return {
        closestEnemy: closestEnemy,
        closestDist: Math.sqrt(closestDistSquared)
    };
}

function rayCastAgainstBuildings(myPos, direction, length) {
    let endPoint = new Vector2(myPos.x + direction.x * length, myPos.y + direction.y * length);

    for (let i = 0; i < placedBuildings.length; i++) {
        if (isIntersecting(myPos, endPoint, placedBuildings[i].cornerPoints[0], placedBuildings[i].cornerPoints[1])) {
            return placedBuildings[i];

        } else if (isIntersecting(myPos, endPoint, placedBuildings[i].cornerPoints[1], placedBuildings[i].cornerPoints[2])) {
            return placedBuildings[i];
        } else if (isIntersecting(myPos, endPoint, placedBuildings[i].cornerPoints[2], placedBuildings[i].cornerPoints[3])) {
            return placedBuildings[i];
        } else if (isIntersecting(myPos, endPoint, placedBuildings[i].cornerPoints[3], placedBuildings[i].cornerPoints[0])) {
            return placedBuildings[i];
        }

    }
    return null;
}

class HealthBar {
    offset = new Vector2(0, 20);
    constructor(pos, width, height, color) {
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.color = color;
        this.backgroundRect = new RectRenderer(new Vector2(pos.x, pos.y), width, height, "white", 1, cam);
        this.innerRect = new RectRenderer(new Vector2(pos.x, pos.y), width, height, color, 1, cam);
    }
    destroy() {
        this.backgroundRect.removeFromDrawList();
        this.innerRect.removeFromDrawList();
    }
    healthBarUpdate(parentPos) {
        this.pos.x = parentPos.x + this.offset.x;
        this.pos.y = parentPos.y + this.offset.y;
        this.backgroundRect.pos.x = this.pos.x;
        this.backgroundRect.pos.y = this.pos.y;
        this.innerRect.pos.x = this.pos.x - (this.width - this.innerRect.width) / 2;
        this.innerRect.pos.y = this.pos.y;
    }
    takeDamage(maxHealth, health) {
        this.innerRect.width = this.width * (Math.max(health, 0) / maxHealth);
        this.innerRect.pos.x = this.pos.x - (this.width - this.innerRect.width) / 2;
    }
}

class Enemy { // Base enemy class
    projectilesHit = [];
    attackRange = 5;
    maxTimeBtwAttack = 1;
    timeBtwAttack = 1;
    damage = 50;
    constructor(pos, maxHealth, speed, collisionRadius, sr) {
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.sr = sr;

        this.healthBar = new HealthBar(new Vector2(pos.x, pos.y), this.sr.width, 5, "red");

        this.collisionRadius = collisionRadius;
        this.speed = speed;
        enemies.push(this);
    }

    update(time) {
        let dir = new Vector2(this.pos.unit().x * -1, this.pos.unit().y * -1);

        this.healthBar.healthBarUpdate(this.pos);
        let result = rayCastAgainstBuildings(this.pos, dir, this.attackRange);

        if (result === null) { // if the enemy is not close enough to attack building
            this.pos.x += dir.x * this.speed * time;
            this.pos.y += dir.y * this.speed * time;
        } else {
            if (this.timeBtwAttack <= 0) {
                this.timeBtwAttack = this.maxTimeBtwAttack;
                this.attack(result);
            } else {
                this.timeBtwAttack -= time;
            }
        }
    }

    attack(buildingToAttack) {
        buildingToAttack.takeDamage(this.damage);
    }

    takeDamage(damage, projectile) {
        if (this.projectilesHit.includes(projectile)) {
            return;
        }
        this.health -= damage;
        this.healthBar.takeDamage(this.maxHealth, this.health);
        if (this.health <= 0) {
            this.die();
        }
        this.projectilesHit.push(projectile);

    }

    die() {
        this.sr.removeFromDrawList();
        this.healthBar.destroy();
        this.healthBar = null;

        //this.sr = null;
        enemies.splice(enemies.indexOf(this), 1);
    }
}

class Goblin extends Enemy {
    constructor(pos) {
        super(pos, 100, 100, 30, new SpriteRenderer(pos, 30, 30, 1, goblinImg, cam));
    }

    update(time) {
        super.update(time);
    }
}

class Orc extends Enemy {
    constructor(pos) {
        super(pos, 1000, 25, 60, new SpriteRenderer(pos, 60, 60, 1, orcImg, cam));
    }

    update(time) {
        super.update(time);
    }
}