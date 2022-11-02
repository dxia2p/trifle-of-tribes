let canvas = document.getElementById("canv");
let hehehaw = document.getElementById("goldTest");
hehehaw.addEventListener("click", goldLevelIncrease)

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
  
    drawAll(ctx);
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


let gold = 0;
function goldLevelIncrease() {
    let goldLevel = 1
    goldLevel + 1;
    console.log(goldLevel)
    
window.setInterval(
function constantGoldIncrease() {
    gold = gold + goldLevel;
    console.log(gold);
},
600);
}
