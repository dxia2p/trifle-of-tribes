class Building{
    constructor(gridWidth, gridHeight, pos, color){
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.pos = pos;
        this.color = color;
    }
}

class GoldStorage extends Building{
    
}

class RockThrower extends Building{
    constructor(gridWidth, gridHeight, pos, color){
        super(gridWidth, gridHeight, pos, color);
    }

    // add logic here
}