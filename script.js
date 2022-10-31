let canvas = document.getElementById("canv");

let ctx = canvas.getContext("2d");

canvas.width = "854";
canvas.height = "480";
class Vector2{
    x = 0;
    y = 0;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


let cam = new Camera(854, 480, new Vector2(0, 0));
let square = new RectRenderer(new Vector2(0, 0), 30, 30, 0, "green", cam);

function loop(time){
    cam.pos.y -= 1;
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);