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
    draw(ctx){
        // first save the untranslated/unrotated context
        ctx.save();

        ctx.beginPath();
        // move the rotation point to the center of the rect
        ctx.translate(this.pos.x+this.width/2, this.pos.y+this.height/2 );
        // rotate the rect
        ctx.rotate(this.degrees*Math.PI/180);

        // draw the rect on the transformed context
        // Note: after transforming [0,0] is visually [x,y]
        //       so the rect needs to be offset accordingly when drawn
        ctx.rect( -this.width/2, -this.height/2, this.width, this.height);

        ctx.fillStyle="green";
        ctx.fill();

        // restore the context to its untranslated/unrotated state
        ctx.restore();
    }
}

function drawAll(ctx) {
    ctx.clearRect(0, 0, 854, 480);
    for(let i = 0; i < drawList.length; i++){
        drawList[i].draw(ctx);
    } 
}