let enemies = [];

function getClosestEnemy(pos){
    let closestDistSquared = 99999999;
    let closestEnemy;
    for(let i = 0; i < enemies.length; i++){
        let distSq = (enemies[i].pos.y - pos.y) ** 2 + (enemies[i].pos.x - pos.x) ** 2;
        if(distSq < closestDistSquared){
            closestDistSquared = distSq;
            closestEnemy = enemies[i];
        }
    }
    return {closestEnemty: closestEnemy,
            closestDist: Math.sqrt(closestDistSquared)};
}

class Enemy{ // Base enemy class
    constructor(pos, maxHealth, sr){
        this.pos = pos;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.sr = sr;
        enemies.push(this);
    }
}

class Goblin extends Enemy{
    constructor(pos){
        super(pos, 100, new SpriteRenderer(pos, 50, 50, 1, goblinImg, cam));
    }
}