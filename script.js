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
let square = new RectRenderer(new Vector2(0, 0), BACKGROUNDSIZE, BACKGROUNDSIZE, "#A6E57A", cam);
let backgroundSquares = [];
const BACKGROUNDSQUARESSIZE = 30;
let offsetRow = false;
for(let y = (BACKGROUNDSIZE / 2); y > -(BACKGROUNDSIZE / 2); y -= BACKGROUNDSQUARESSIZE){
    if(!offsetRow){
        for(let x = BACKGROUNDSIZE / -2; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", cam));
        }
        offsetRow = true;
    }else{
        for(let x = (BACKGROUNDSIZE / -2) + BACKGROUNDSQUARESSIZE; x < BACKGROUNDSIZE / 2; x += BACKGROUNDSQUARESSIZE * 2){
            backgroundSquares.push(new RectRenderer(new Vector2(x, y), 
            BACKGROUNDSQUARESSIZE, BACKGROUNDSQUARESSIZE, "#78D03B", cam));
        }
        offsetRow = false
    }

}

function loop(time){
    
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);