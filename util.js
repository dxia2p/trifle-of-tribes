class Vector2 {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    magnitude() {
        return Math.sqrt(this.y ** 2 + this.x ** 2);
    }

    unit() {
        let mag = this.magnitude();
        return new Vector2(this.x / mag, this.y / mag);
    }
}

// line segment intersection
function getOrientation(p, q, r) {
    let val = (q.y - p.y) * (r.x - q.x) -
        (q.x - p.x) * (r.y - q.y); // get the difference between slopes of the lines

    if (val == 0) return 0; // collinear

    if (val > 0) {
        return 1;
    } else {
        return 2;
    }
}
function onSegment(p, q, r) {
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
        return true;

    return false;
}
// returns if 2 lines p1 q1 and p2 q2 are intersecting
function isIntersecting(p1, q1, p2, q2) {
    // get the 4 orientations of the lines
    let o1 = getOrientation(p1, q1, p2);
    let o2 = getOrientation(p1, q1, q2);
    let o3 = getOrientation(p2, q2, p1);
    let o4 = getOrientation(p2, q2, q1);

    if (o1 != o2 && o3 != o4)
        return true;

    // special cases
    // p1, q1 and p2 are collinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and q2 are collinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are collinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

    // p2, q2 and q1 are collinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false;
}

isIntersecting(new Vector2(1, 0), new Vector2(2, 0), new Vector2(0.5, -0.5), new Vector2(0.5, 0.5));