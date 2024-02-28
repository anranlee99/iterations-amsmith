import p5 from 'p5';

class FixedPointBuffer {
    private gfx: p5.Graphics;

    constructor(p: p5, w: number, h: number) {
        this.gfx = p.createGraphics(w, h, p.webglVersion === '1' ? p.WEBGL : p.P2D);
    }

    public background(r: number, g: number, b: number): void {
        this.gfx.background(r, g, b);
    }

    public add(x: number, y: number, r: number, g: number, b: number, a: number): void {
        this.gfx.fill(r, g, b, a);
        this.gfx.noStroke();
        this.gfx.ellipse(x, y, 1, 1); // Draw a small ellipse as a point
    }

    public getGraphics(): p5.Graphics {
        return this.gfx;
    }
}

new p5((p: p5) => {
    let buf: FixedPointBuffer;
    let cx: number, cy: number, sc: number;
    const ncps = 5000;
    const niters = 16;

    let pa: number, pb: number, pc: number, pd: number;
    let mya: number = 255; // Adjust alpha for visibility

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        buf = new FixedPointBuffer(p, p.width, p.height);
        cx = p.width / 2;
        cy = p.height / 2;
        sc = p.width / (2 * Math.PI);
        next();
    };

    function next(): void {
        buf.background(0, 0, 0);
        const r = 2.5;
        pa = p.random(-r, r);
        pb = p.random(-r, r);
        pc = p.random(-r, r);
        pd = p.random(-r, r);
    }

    p.mousePressed = () => {
        p.loop();
        next();
    };

    p.draw = () => {
        drawIntoBuffer();
        p.image(buf.getGraphics(), -p.width / 2, -p.height / 2); // Center the buffer on the canvas
        p.noLoop(); // To pause the loop for observation
    };

    function drawIntoBuffer(): void {
        const s = Math.ceil(Math.sqrt(ncps));
        const is = 2.0 / s;
        for (let i = 0; i < ncps; i++) {
            let x = 2 * (i % s) / s - 1 + p.random(0, is);
            let y = 2 * Math.floor(i / s) / s - 1 + p.random(0, is);

            for (let j = 0; j < niters; j++) {
                const t = j / niters;
                let xp = p.sin(pa * x) + p.sin(pb * y);
                let yp = p.sin(pc * x) + p.sin(pd * y);

                const r = Math.floor((1 - t) * 255); // Red decreases with t
                const g = Math.floor(2 * t * (1 - t) * 255); // Green peaks in the middle
                const b = Math.floor(t * 255); // Blue increases with t

                buf.add(cx + xp * sc, cy + yp * sc, r, g, b, mya); // Apply alpha scaling
            }
        }
    }
});
