
export const config = {
    count: { type: 'range', min: 20, max: 200, value: 60, label: 'Firefly Count' },
    speed: { type: 'range', min: 0.1, max: 2, step: 0.1, value: 0.5, label: 'Activity' },
    glowOpacity: { type: 'range', min: 0.1, max: 1, step: 0.1, value: 0.3, label: 'Glow Opacity' },
    glowSize: { type: 'range', min: 1, max: 10, option: 10, value: 4, label: 'Glow Size Base' },
    color: { type: 'color', value: '#facc15', label: 'Glow Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let flies = [];

    const mouse = { x: -1000, y: -1000 };

    class Firefly {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.angle = Math.random() * Math.PI * 2;
            this.baseSpeed = Math.random() * 0.5 + 0.2;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random();
            this.alphaDir = Math.random() > 0.5 ? 0.01 : -0.01;
        }

        update() {
            const spd = this.baseSpeed * config.speed.value;

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 200) {
                this.angle = Math.atan2(dy, dx) + Math.PI;
            }

            this.angle += (Math.random() - 0.5) * 0.2;
            this.x += Math.cos(this.angle) * spd;
            this.y += Math.sin(this.angle) * spd;

            this.alpha += this.alphaDir;
            if (this.alpha > 1 || this.alpha < 0) this.alphaDir *= -1;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            const glow = Math.max(0, this.alpha);

            ctx.fillStyle = config.color.value;
            ctx.globalAlpha = glow;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            // Fake glow ring
            if (isDark) {
                ctx.globalAlpha = glow * config.glowOpacity.value;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * config.glowSize.value, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
    }

    function initFlies() {
        flies = [];
        if (isDark && config.color.value === '#ea580c') config.color.value = '#facc15';
        if (!isDark && config.color.value === '#facc15') config.color.value = '#ea580c';

        for (let i = 0; i < config.count.value; i++) {
            flies.push(new Firefly());
        }
    }

    function animate() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        flies.forEach(f => {
            f.update();
            f.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    initFlies();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#facc15' : '#ea580c';
        },
        updateConfig(key, val) {
            if (key === 'count') initFlies();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
