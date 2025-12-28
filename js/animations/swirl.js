
export const config = {
    count: { type: 'range', min: 100, max: 1500, value: 800, label: 'Particle Count' },
    speed: { type: 'range', min: 0.1, max: 10, value: 2, label: 'Swirl Speed' },
    // Trail controls fade amount. Lower fade = longer trail.
    trail: { type: 'range', min: 0.02, max: 0.3, step: 0.01, value: 0.1, label: 'Trail Fade (Low=Long)' },
    color: { type: 'color', value: '#818cf8', label: 'Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let particles = [];

    const mouse = { x: width / 2, y: height / 2 };

    class Particle {
        constructor() {
            this.init(true);
        }

        init(randomValues = false) {
            const angle = Math.random() * Math.PI * 2;
            const dist = randomValues ? Math.random() * width * 0.5 : width * 0.5;

            this.x = width / 2 + Math.cos(angle) * dist;
            this.y = height / 2 + Math.sin(angle) * dist;
            this.size = Math.random() * 1.5 + 0.5;
            this.life = Math.random() * 100 + 50;
        }

        update() {
            const tx = mouse.x - this.x;
            const ty = mouse.y - this.y;
            const dist = Math.sqrt(tx * tx + ty * ty);

            const tanX = ty;
            const tanY = -tx;
            const tLen = Math.sqrt(tanX * tanX + tanY * tanY);

            const spd = config.speed.value;

            if (dist > 10) {
                this.x += (tanX / tLen) * spd;
                this.y += (tanY / tLen) * spd;
                this.x += (tx / dist) * (spd * 0.2);
                this.y += (ty / dist) * (spd * 0.2);
            }

            this.life--;
            // If trails are long, we want particles to persist longer?
            // "Swirl Speed 가 느려도 트레일이 충분히 길게 따라오도록"
            // This means we should clear the screen less frequently or with lower opacity. 

            if (this.life <= 0 || dist < 10) {
                this.init();
                const angle = Math.random() * Math.PI * 2;
                this.x = mouse.x + Math.cos(angle) * width * 0.4;
                this.y = mouse.y + Math.sin(angle) * width * 0.4;
            }
        }

        draw() {
            ctx.fillStyle = config.color.value;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        if (!isDark && config.color.value === '#818cf8') config.color.value = '#4f46e5';
        else if (isDark && config.color.value === '#4f46e5') config.color.value = '#818cf8';

        for (let i = 0; i < config.count.value; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        // Here we control the trail length via opacity of the fillRect
        // Lower opacity = previous frames stay longer = longer trails
        // We decouple this from speed, but user asked for it to be long even if slow.
        // So we expose 'trail' config.

        let trailOpacity = config.trail.value;
        const bg = isDark ? `rgba(15, 23, 42, ${trailOpacity})` : `rgba(248, 250, 252, ${trailOpacity})`;

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        animationId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            mouse.x = w / 2; mouse.y = h / 2;
            initParticles();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#818cf8' : '#4f46e5';
        },
        updateConfig(key, val) {
            if (key === 'count') initParticles();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
