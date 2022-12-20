let drawList = [];
class Camera {
    constructor(width, height, pos) {
        this.width = width;
        this.height = height;
        this.pos = pos;
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
    //add clone function later im dont want to do it right now
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
    constructor(renderer){
        this.renderer = renderer;
    }

    update(time){
        this.renderer.pos.x += this.direction.x * this.speed * time;
        this.renderer.pos.y += this.direction.y * this.speed * time;
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
    constructor(pos, renderer, amount, speed, time, destroyAfterPlay){
        this.pos = pos;
        this.amount = amount;
        this.speed = speed;
        this.maxTime = time;
        this.time = time;
        this.destroyAfterPlay = destroyAfterPlay;
        this.particles.push(new Particle(renderer));
        this.particles[0].renderer.render = false;
        this.particles[0].speed = this.speed;
        for(let i = 1; i < this.amount; i++){
            this.particles.push(new Particle(renderer.clone()));
            this.particles[i].renderer.render = false;
            this.particles[i].speed = this.speed;
        }
        particleSystems.push(this)
    }
    updateAll(time){
        if(this.isPlaying){
            for(let i = 0; i < this.particles.length; i++){
                this.particles[i].update(time);
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
            this.particles[i].renderer.render = true;
            this.particles[i].renderer.pos.x = this.pos.x;
            this.particles[i].renderer.pos.y = this.pos.y;
            let randAngle = Math.random() * 2 * Math.PI;
            this.particles[i].direction.x = Math.cos(randAngle);
            this.particles[i].direction.y = Math.sin(randAngle);
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