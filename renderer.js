let drawList = [];
class Camera {
    isShaking = false;
    shakeStrength = 0;
    maxShakeInterval = 0;
    shakeInterval = 0;
    shakeTime = 0;
    direction = new Vector2(0, 0);
    constructor(width, height, pos) {
        this.width = width;
        this.height = height;
        this.pos = pos;
    }

    update(time){
        if(this.isShaking){
            if(this.shakeTime <= 0){
                this.isShaking = false;
            }else{
                if(this.shakeInterval <= 0){
                    this.shakeOnce();
                    this.shakeInterval = this.maxShakeInterval;
                }else{
                    if(this.shakeInterval <= this.maxShakeInterval / 2){
                        this.pos.x -= this.direction.x;
                        this.pos.y -= this.direction.y;
                    }
                    //console.log(this.shakeInterval)
                    this.shakeInterval -= time;
                }
                this.shakeTime -= time;
            }
        }
    }

    shakeOnce(){
        let randAngle = randomRange(0, 2 * Math.PI); // get random angle from 0 to 2 pi (radians)
        let x = Math.cos(randAngle) * this.shakeStrength;
        let y = Math.sin(randAngle) * this.shakeStrength;
        this.pos.x += x;
        this.pos.y += y;
        this.direction.x = x;
        this.direction.y = y;
    }

    cameraShake(strength, shakeInterval, shakeTime){
        //console.log("AAAA")
        this.isShaking = true;
        this.shakeStrength = strength;
        this.maxShakeInterval = shakeInterval;
        //this.shakeInterval = shakeInterval;
        this.shakeTime = shakeTime;
    }
}

class Renderer {
    //drawOrder = 0; // higher draw order means it is on top (DOESN'T WORK AND I DONT KNOW HOW TO MAKE IT WORK)
    render = true;
    constructor() {
        drawList.push(this);
    }
    draw() {

    }
    removeFromDrawList() {
        let i = drawList.indexOf(this);
        if (i !== -1) {
            drawList.splice(i, 1);
        }
    }

    clone(){

    }
}

class RectRenderer extends Renderer {

    constructor(pos, width, height, color, alpha, camera) {
        super();
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.color = color;
        this.alpha = alpha;
        this.camera = camera;
    }
    draw(ctx) {
        if(!this.render)
            return;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;

        ctx.rect((this.pos.x - (this.width / 2) - this.camera.pos.x + (this.camera.width / 2)),
            (-this.pos.y - (this.height / 2) - (-this.camera.pos.y - this.camera.height / 2)), this.width, this.height);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    clone(){
        return new RectRenderer(new Vector2(this.pos.x, this.pos.y), this.width, this.height, this.color, this.alpha, this.camera);
    }
}

class SpriteRenderer extends Renderer {
    rotation = 0; // in radians

    constructor(pos, width, height, alpha, img, camera) {
        super();
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.alpha = alpha;
        this.img = img;
        this.camera = camera;
    }
    draw(ctx) {
        if(!this.render)
            return;
        ctx.save();

        //ctx.translate(this.width / 2, this.height / 2);
        let posOnCanvas = new Vector2((this.pos.x - this.camera.pos.x + (this.camera.width / 2)), -this.pos.y - (-this.camera.pos.y - this.camera.height / 2));

        ctx.translate(posOnCanvas.x, posOnCanvas.y);
        ctx.rotate(this.rotation);
        posOnCanvas = new Vector2(-(this.width / 2), -(this.height / 2));
        ctx.translate(posOnCanvas.x, posOnCanvas.y);

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    clone(){
        return new SpriteRenderer(new Vector2(this.pos.x, this.pos.y), this.width, this.height, this.alpha, this.img, this.camera);
    }
}

function drawAll(ctx) {
    ctx.clearRect(0, 0, 854, 480);
    for (let i = 0; i < drawList.length; i++) {
        drawList[i].draw(ctx);
    }
}

class Particle{
    direction = new Vector2(0, 0);
    speed = 0;
    lifetime = 0;
    maxLifetime = 0;
    constructor(renderer){
        this.renderer = renderer;
    }

    update(time){
        this.renderer.pos.x += this.direction.x * this.speed * time;
        this.renderer.pos.y += this.direction.y * this.speed * time;
        if(this.lifetime <= 0){
            this.renderer.render = false;

        }else{
            this.lifetime -= time;
        }
    }

    destroy(){
        this.renderer.removeFromDrawList();
        this.renderer = null;
    }
}

let particleSystems = [];
class ParticleSystem{
    particles = [];
    isPlaying = false;
    constructor(pos, renderer, amount, speed, maxTime, destroyAfterPlay){
        this.pos = pos;
        this.amount = amount;
        this.speed = speed;
        this.maxTime = maxTime; // the maximum lifetime of every particle, but particles can have their individual lifetimes
        this.time = maxTime;
        this.gravity = 0;
        this.destroyAfterPlay = destroyAfterPlay;
        this.particles.push(new Particle(renderer));
        this.particles[0].renderer.render = false;
        this.particles[0].speed = this.speed;
        for(let i = 1; i < this.amount; i++){
            this.particles.push(new Particle(renderer.clone()));
            this.particles[i].renderer.render = false;
            this.particles[i].speed = this.speed;
            this.particles[i].maxLifetime = maxTime;
            this.particles[i].lifetime = maxTime;
        }
        particleSystems.push(this)
    }
    updateAll(time){
        if(this.isPlaying){
            for(let i = 0; i < this.particles.length; i++){
                this.particles[i].update(time);
                this.particles[i].direction.y += this.gravity * time;
            }
            if(this.time <= 0){
                this.stop();
                this.maxTime = time;
            }else{
                this.time -= time;
            }
        }
    }
    stop(){
        if(!this.destroyAfterPlay){
            this.isPlaying = false;
            for(let i = 0; i < this.particles.length; i++){
                this.particles[i].renderer.render = false;
            }
        }else{
            this.destroy();
        }

    }
    play(){
        this.isPlaying = true;

        for(let i = 0; i < this.particles.length; i++){
            let p = this.particles[i];
            p.renderer.render = true;
            p.lifetime = p.maxLifetime;
            p.renderer.pos.x = this.pos.x;
            p.renderer.pos.y = this.pos.y;
            let randAngle = Math.random() * 2 * Math.PI;
            p.direction.x = Math.cos(randAngle);
            p.direction.y = Math.sin(randAngle);
        }   
    }
    destroy(){
        for(let i = 0; i < this.particles.length; i++){
            this.particles[i].destroy();
        }
        this.particles = [];
        particleSystems.splice(particleSystems.indexOf(this), 1);
    }
}

function updateAllParticleSystems(time){
    for(let i = 0; i < particleSystems.length; i++){
        particleSystems[i].updateAll(time);
    }
}