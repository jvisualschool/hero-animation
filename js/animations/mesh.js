
export const config = {
    speed: { type: 'range', min: 0.1, max: 2, value: 0.5, label: 'Float Speed' },
    blur: { type: 'range', min: 20, max: 150, value: 80, label: 'Blur Amount' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let time = 0;

    // Mouse Parallax
    const mouse = { x: width / 2, y: height / 2 };

    class Orb {
        constructor(colorLight, colorDark, x, y, r, delay) {
            this.colorLight = colorLight;
            this.colorDark = colorDark;
            this.baseX = x; // explicit or relative
            this.baseY = y;
            this.r = r;
            this.delay = delay;
        }

        draw(t) {
            // Calculate float
            // CSS keyframes: 0% 0,0; 33% 50,-50; 66% -50,50
            // We approximate this with sin/cos
            const floatX = Math.sin(t * 0.001 + this.delay) * 50 * config.speed.value;
            const floatY = Math.cos(t * 0.0012 + this.delay) * 50 * config.speed.value;

            // Mouse Parallax (small op)
            const mx = (mouse.x - width / 2) * 0.05;
            const my = (mouse.y - height / 2) * 0.05;

            // Resolve position relative to screen (simple mapping)
            // The CSS used fixed pixels or %, let's use %
            let cx = width * this.baseX + floatX + mx;
            let cy = height * this.baseY + floatY + my;

            const color = isDark ? this.colorDark : this.colorLight;

            // Draw Gradient Orb
            const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, this.r);
            g.addColorStop(0, color); // solid center color? No, radial from source
            // CSS: radial-gradient(circle, #color 0%, transparent 70%)
            g.addColorStop(0, color);
            g.addColorStop(0.7, 'rgba(0,0,0,0)');

            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(cx, cy, this.r, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Converted Orbs from CSS
    const orbs = [
        // Left Top
        new Orb('#667eea', '#00d4ff', 0.2, 0.2, 500, 0),
        // Right Bottom
        new Orb('#764ba2', '#7928ca', 0.8, 0.8, 400, 2),
        // Center
        new Orb('#f093fb', '#ff0080', 0.5, 0.5, 450, 4)
    ];

    function draw() {
        const bg = isDark ? '#0a0a0a' : '#f0f0f0';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        // Blur context?
        // Canvas blur is expensive via filter property `ctx.filter`.
        // But for 3 objects it's fine.
        ctx.filter = `blur(${config.blur.value}px)`;

        orbs.forEach(o => o.draw(time));

        ctx.filter = 'none';
    }

    let lastTime = 0;
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        time += deltaTime;
        draw();
        animationId = requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

    return {
        resize(w, h) {
            width = w;
            height = h;
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
            // Orbs move slightly with mouse in draw()
        },
        setTheme(dark) {
            isDark = dark;
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
