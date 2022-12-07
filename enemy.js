let enemies = [];

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

class Enemy { // Base enemy class
    constructor(pos, maxHealth, speed, sr) {
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.sr = sr;
        this.speed = speed;
        enemies.push(this);
    }
}

class Goblin extends Enemy {
    constructor(pos) {
        super(pos, 100, 1, new SpriteRenderer(pos, 30, 30, 30, goblinImg, cam));
    }

    update(time) {
        let a = Math.atan2(this.pos.y, this.pos.x);
        this.pos.x -= this.speed * Math.cos(a);
        this.pos.y -= this.speed * Math.sin(a);
    }
}