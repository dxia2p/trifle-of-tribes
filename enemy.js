let enemies = [];
function updateAllEnemies(changeInTime){
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

class Enemy { // Base enemy class
    projectilesHit = [];
    constructor(pos, maxHealth, speed, collisionRadius, sr) {
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.sr = sr;
        this.collisionRadius = collisionRadius;
        this.speed = speed;
        enemies.push(this);
    }

    takeDamage(damage, projectile){
        if(this.projectilesHit.includes(projectile)){
            return;
        }
        this.health -= damage;
        //console.log(this.health);
        if(this.health <= 0){
            this.die();
        }
        this.projectilesHit.push(projectile);
    }

    die(){        
        this.sr.removeFromDrawList();
        //this.sr = null;
        enemies.splice(enemies.indexOf(this), 1);
    }
}

class Goblin extends Enemy {
    constructor(pos) {
        super(pos, 100, 1, 30, new SpriteRenderer(pos, 30, 30, 30, goblinImg, cam));
    }

    update(time) {
        if(Math.sqrt(this.pos.x ** 2 + this.pos.y ** 2) < 60){
            return;
        }
        let a = Math.atan2(this.pos.y, this.pos.x); // opposite of tan (tan = y/x so we can get the angle between goblin and center from this)
        this.pos.x -= this.speed * Math.cos(a);
        this.pos.y -= this.speed * Math.sin(a);
    }

}