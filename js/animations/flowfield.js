
export const config = {
    // Reduced speed min
    speed: { type: 'range', min: 0.1, max: 10, value: 3, label: 'Flow Speed' },
    trail: { type: 'range', min: 0.01, max: 0.2, step: 0.01, value: 0.05, label: 'Trail Length' },
    width: { type: 'range', min: 1, max: 5, step: 0.5, value: 1.5, label: 'Line Width' },
    color: { type: 'color', value: '#38bdf8', label: 'Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let particles = [];

    // Mouse
    const mouse = { x: -1000, y: -1000 };

    function noise(x, y) {
        return Math.sin(x * 0.005) + Math.cos(y * 0.005);
    }

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.hue = isDark ? 200 + Math.random() * 60 : 210 + Math.random() * 60;
        }

        update() {
            const n = noise(this.x, this.y);
            const angle = n * Math.PI * 2;

            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let vx = Math.cos(angle) * config.speed.value;
            let vy = Math.sin(angle) * config.speed.value;

            if (dist < 200) {
                const force = (200 - dist) / 200;
                vx -= (dx / dist) * force * 5;
                vy -= (dy / dist) * force * 5;
            }

            this.x += vx;
            this.y += vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = config.color.value;
            ctx.fillRect(this.x, this.y, config.width.value, config.width.value);
        }
    }

    function initParticles() {
        particles = [];
        const count = 500;
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);
    }

    function animate() {
        const bg = isDark ? '#0f172a' : '#f8fafc';

        ctx.fillStyle = bg;
        ctx.globalAlpha = config.trail.value;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    if (isDark && config.color.value === '#0284c7') config.color.value = '#38bdf8';
    if (!isDark && config.color.value === '#38bdf8') config.color.value = '#0284c7';

    initParticles();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initParticles(); // reset on resize to avoid smudge
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#38bdf8' : '#0284c7';
            initParticles();
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
