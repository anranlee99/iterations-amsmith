import p5 from 'p5';

class FixedPointBuffer {
    private gfx: p5.Graphics;

    constructor(p: p5, w: number, h: number) {
        // Ensure the graphics buffer is compatible with WebGL
        this.gfx = p.createGraphics(w, h, p.WEBGL);
        this.gfx.noStroke();
    }

    public background(r: number, g: number, b: number): void {
        this.gfx.background(r, g, b);
    }

    public add(x: number, y: number, r: number, g: number, b: number): void {

        // Directly draw onto the graphics object
        this.gfx.fill(r, g, b);
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

    p.setup = () => {
        p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
        buf = new FixedPointBuffer(p, p.width, p.height);
        // Adjust for WEBGL's center origin
        cx = 0;
        cy = 0;
        // Adjust scale factor if necessary
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
        // Draw the off-screen buffer at the center of the canvas
        p.image(buf.getGraphics(), -buf.getGraphics().width / 2, -buf.getGraphics().height / 2);
        p.noLoop(); // To pause the loop for observation. Adjust as needed.
    };
    

    function drawIntoBuffer(): void {
        const s = Math.ceil(Math.sqrt(ncps));
        const is = 2.0 / s;
        for (let i = 0; i < ncps; i++) {
            let x = 2 * (i % s) / s - 1 + p.random(0, is);
            let y = 2 * Math.floor(i / s) / s - 1 + p.random(0, is);

            for (let j = 0; j < niters; j++) {
                const t = j / niters;
                const xp = Math.sin(pa * x) + Math.sin(pb * y);
                const yp = Math.sin(pc * x) + Math.sin(pd * y);
                const r = Math.round((1 - t) * 255);
                const g = Math.round(2 * t * (1 - t) * 255);
                const b = Math.round(t * 255);
                buf.add(cx + xp * sc, cy + yp * sc, r, g, b);
            }
        }
    }
});
