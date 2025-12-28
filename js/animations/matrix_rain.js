
export const config = {
    // Reduced speed min from 1 to 0.1, step from default 1 (implied) to 0.1
    speed: { type: 'range', min: 0.1, max: 2, step: 0.1, value: 0.2, label: 'Rain Speed' },
    density: { type: 'range', min: 10, max: 30, value: 16, label: 'Font Size' },
    color: { type: 'color', value: '#00ff41', label: 'Matrix Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;

    let drops = [];
    let fontSize = config.density.value;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';

    // Mouse interaction: disrupt rain
    const mouse = { x: -1000, y: -1000 };

    function initDrops() {
        fontSize = parseInt(config.density.value);
        const columns = Math.ceil(width / fontSize);
        // Randomize initial positions nicely
        drops = Array(columns).fill(0).map(() => Math.random() * height / fontSize * -1);
    }

    function draw() {
        // Trail - Lower opacity means longer trails and clearer text at low speeds
        // We adjust opacity based on speed to prevent text from fading out too fast when moving slowly
        const speed = config.speed.value;
        const fadeOpacity = Math.max(0.01, Math.min(0.05, speed * 0.1));

        ctx.fillStyle = isDark ? `rgba(0, 0, 0, ${fadeOpacity})` : `rgba(232, 245, 233, ${fadeOpacity})`;
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px monospace`;
        let textColor = config.color.value;

        ctx.fillStyle = textColor;

        for (let i = 0; i < drops.length; i++) {
            // Deterministic character based on position constant to avoid shimmering noise at low speeds
            // We use a simple hash of column (i) and row (Math.floor(drops[i]))
            const rowIndex = Math.floor(drops[i]);
            const charIndex = Math.abs((i * 13 + rowIndex * 2333) % chars.length);
            const text = chars[charIndex];

            const x = i * fontSize;
            const y = rowIndex * fontSize; // Snap to grid

            // Mouse
            const dist = Math.abs(x - mouse.x);
            if (dist < 50 && Math.abs(y - mouse.y) < 50) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = textColor;
            }

            ctx.fillText(text, x, y);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0; // Reset to top
            }

            // Speed control
            drops[i] += speed;
        }
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    initDrops();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initDrops();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            if (dark && config.color.value === '#1b5e20') config.color.value = '#00ff41';
            if (!dark && config.color.value === '#00ff41') config.color.value = '#1b5e20';
        },
        updateConfig(key, val) {
            if (key === 'density') initDrops();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
