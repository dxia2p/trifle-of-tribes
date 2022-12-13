class Vector2 {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude(){
        return Math.sqrt(this.y ** 2 + this.x ** 2);
    }
}