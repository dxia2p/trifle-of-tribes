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
        this.innerRect.width = this.width * (health / maxHealth);
        this.innerRect.pos.x = this.pos.x - (this.width - this.innerRect.width) / 2;
    }
}

class Enemy { // Base enemy class
    projectilesHit = [];
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
        this.healthBar.healthBarUpdate(this.pos);
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
        super(pos, 100, 100, 30, new SpriteRenderer(pos, 30, 30, 30, goblinImg, cam));
    }

    update(time) {
        if (Math.sqrt(this.pos.x ** 2 + this.pos.y ** 2) > 60) {
            let a = Math.atan2(this.pos.y, this.pos.x); // opposite of tan (tan = y/x so we can get the angle between goblin and center from this)
            this.pos.x -= this.speed * Math.cos(a) * time;
            this.pos.y -= this.speed * Math.sin(a) * time;
        }

        super.update(time);
    }

}