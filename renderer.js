let drawList = [];
class Camera{
    constructor(width, height, pos){
        this.width = width;
        this.height = height;
        this.pos = pos;
    }
}
class Renderer{
    constructor(){
        drawList.push(this);
    }
    draw(){

    }
}

class RectRenderer extends Renderer{
    constructor(pos, width, height, degrees){
        super();
        this.pos = pos;
        this.width = width;
        this.height = height;
        this.degrees = degrees;
    }
    draw(){

    }
}

function drawAll() {
    for(let i = 0; i < drawList.length; i++){
        drawList[i].draw();
    } 
}