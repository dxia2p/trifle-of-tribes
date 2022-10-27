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


let cam = Camera(854, 480, Vector2(0, 0));

function loop(time){
    drawAll();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);