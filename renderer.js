let drawList = [];
class Camera {
    constructor(width, height, pos) {
        this.width = width;
        this.height = height;
        this.pos = pos;
    }
}

class Renderer {
    //drawOrder = 0; // higher draw order means it is on top
    constructor() {
        drawList.push(this);
    }
    draw() {

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
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.rect((this.pos.x - (this.width / 2) - this.camera.pos.x + (this.camera.width / 2)),
            this.pos.y - (this.height / 2) - (-this.camera.pos.y - this.camera.height / 2), this.width, this.height);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class SpriteRenderer extends Renderer{
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
        ctx.globalAlpha = this.alpha;
        ctx.drawImage(this.img, (this.pos.x - (this.width / 2) - this.camera.pos.x + (this.camera.width / 2)),
        this.pos.y - (this.height / 2) - (-this.camera.pos.y - this.camera.height / 2), this.width, this.height);
        ctx.globalAlpha = 1;
    }
}

function drawAll(ctx) {
    ctx.clearRect(0, 0, 854, 480);
    for (let i = 0; i < drawList.length; i++) {
        drawList[i].draw(ctx);
    }
}