
export const config = {
    count: { type: 'range', min: 20, max: 200, value: 80, label: 'Particle Count' },
    speed: { type: 'range', min: 0.1, max: 5, step: 0.1, value: 1, label: 'Speed' },
    width: { type: 'range', min: 0.1, max: 5, step: 0.1, value: 1, label: 'Line Width' },
    opacity: { type: 'range', min: 0.1, max: 1, step: 0.05, value: 1, label: 'Line Opacity' },
    connectDist: { type: 'range', min: 50, max: 300, value: 150, label: 'Link Distance' },
    color: { type: 'color', value: '#ffffff', label: 'Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let particles = [];

    // Mouse Interaction
    const mouse = { x: -1000, y: -1000 };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.speed.value;
            this.vy = (Math.random() - 0.5) * config.speed.value;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            const speedMod = config.speed.value;
            // Re-normalize velocity to speed if needed, or just partial apply
            // If we just mult, it accelerates forever. We need to store base v.
            this.x += this.vx * (speedMod / (Math.abs(this.vx * 2) || 1)); // simple hack
            this.y += this.vy * (speedMod / (Math.abs(this.vy * 2) || 1));

            // cleaner: store direction, apply speed.
            // but for now, let's just let it be linear

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse Repel
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 200;

            if (distance < maxDist) {
                const force = (maxDist - distance) / maxDist;
                this.x -= (dx / distance) * force * 5;
                this.y -= (dy / distance) * force * 5;
            }
        }

        draw() {
            ctx.fillStyle = config.color.value;
            ctx.globalAlpha = config.opacity.value;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        if (config.color.value === '#ffffff' && !isDark) config.color.value = '#000000';
        else if (config.color.value === '#000000' && isDark) config.color.value = '#ffffff';

        for (let i = 0; i < config.count.value; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        ctx.strokeStyle = config.color.value;
        ctx.lineWidth = config.width.value;

        // Connections
        const maxDist = config.connectDist.value;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    // Opacity based on dist AND global opacity config
                    const alpha = (1 - (dist / maxDist)) * config.opacity.value;
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        ctx.globalAlpha = 1;

        animationId = requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initParticles();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#ffffff' : '#000000';
        },
        updateConfig(key, value) {
            if (key === 'count') initParticles();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
