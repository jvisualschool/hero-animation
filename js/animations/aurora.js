
export const config = {
    count: { type: 'range', min: 1, max: 20, value: 5, label: 'Layer Count' },
    speed: { type: 'range', min: 0.1, max: 5, step: 0.1, value: 1, label: 'Speed Multiplier' },
    size: { type: 'range', min: 100, max: 800, value: 400, label: 'Base Size' },
    randomize: { type: 'button', label: 'Randomize Colors', value: false }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let layers = [];
    let animationId;
    let width = canvas.width;
    let height = canvas.height;

    // Custom palette created by randomization
    let customPalette = [];

    class Layer {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.radius = config.size.value + Math.random() * 200;
            this.color = '';
        }

        update() {
            this.x += this.vx * config.speed.value * 0.5;
            this.y += this.vy * config.speed.value * 0.5;

            if (this.x < -this.radius) this.vx *= -1;
            if (this.x > width + this.radius) this.vx *= -1;
            if (this.y < -this.radius) this.vy *= -1;
            if (this.y > height + this.radius) this.vy *= -1;
        }

        draw(ctx) {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, this.color);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const defaultThemes = {
        dark: ['rgba(56, 189, 248, 0.4)', 'rgba(129, 140, 248, 0.4)', 'rgba(167, 243, 208, 0.4)', 'rgba(244, 114, 182, 0.4)'],
        light: ['rgba(56, 189, 248, 0.6)', 'rgba(129, 140, 248, 0.6)', 'rgba(167, 243, 208, 0.6)', 'rgba(244, 114, 182, 0.6)']
    };

    function generateRandomPalette() {
        const count = 4;
        customPalette = [];
        for (let i = 0; i < count; i++) {
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(60 + Math.random() * 40);
            const l = isDark ? Math.floor(40 + Math.random() * 20) : Math.floor(60 + Math.random() * 20);
            const a = isDark ? 0.4 : 0.6;
            customPalette.push(`hsla(${h}, ${s}%, ${l}%, ${a})`);
        }
    }

    function createLayers() {
        layers = [];
        let colors = customPalette.length > 0 ? customPalette : (isDark ? defaultThemes.dark : defaultThemes.light);

        for (let i = 0; i < config.count.value; i++) {
            const layer = new Layer();
            layer.color = colors[Math.floor(Math.random() * colors.length)];
            layers.push(layer);
        }
    }

    function animate() {
        ctx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';
        layers.forEach(layer => {
            layer.update();
            layer.draw(ctx);
        });
        ctx.globalCompositeOperation = 'source-over';

        animationId = requestAnimationFrame(animate);
    }

    createLayers();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
        },
        setTheme(dark) {
            isDark = dark;
            customPalette = []; // Reset custom on theme switch? User logic might differ, but safe default.
            createLayers();
        },
        updateConfig(key, value) {
            if (key === 'randomize') {
                generateRandomPalette();
                createLayers();
            } else if (key === 'count' || key === 'size') {
                createLayers();
            }
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
