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
const BACKGROUNDSIZE = 2000;
let square = new RectRenderer(new Vector2(0, 0), BACKGROUNDSIZE, BACKGROUNDSIZE, 0, "#A6E57A", cam);
let backgroundSquares = [];
const BACKGROUNDSQUARESSIZE = 30;
for(let y = 0; y < BACKGROUNDSIZE; y+= BACKGROUNDSQUARESSIZE){
    if(y % 2 == 0){
        for(let x = 0; x < BACKGROUNDSIZE; x += BACKGROUNDSQUARESSIZE * 2){

        }   
    }

}

function loop(time){
    
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);