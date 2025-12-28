
export const config = {
    pairs: { type: 'range', min: 10, max: 100, value: 40, label: 'Base Pairs' },
    speed: { type: 'range', min: 0.001, max: 0.1, step: 0.001, value: 0.02, label: 'Rotation Speed' },
    color: { type: 'color', value: '#38bdf8', label: 'Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let angle = 0;

    const mouse = { x: width / 2, y: height / 2 };

    const radius = 100;
    const separation = 20;

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const bendX = (mouse.x - width / 2) * 0.2;
        const bendY = (mouse.y - height / 2) * 0.2;

        const cx = width / 2;
        const cy = height / 2 - (config.pairs.value * separation) / 2;

        for (let i = 0; i < config.pairs.value; i++) {
            const yOffset = i * separation;
            const theta = i * 0.2 + angle;

            const x1 = Math.cos(theta) * radius;
            const z1 = Math.sin(theta) * radius;

            const x2 = Math.cos(theta + Math.PI) * radius;
            const z2 = Math.sin(theta + Math.PI) * radius;

            const depth = 400;
            const scale1 = depth / (depth + z1);
            const scale2 = depth / (depth + z2);

            const bx = cx + bendX * (i / config.pairs.value - 0.5);
            const by = cy + bendY * (i / config.pairs.value - 0.5);

            const px1 = bx + x1 * scale1;
            const py1 = by + yOffset * scale1;
            const px2 = bx + x2 * scale2;
            const py2 = by + yOffset * scale2;

            ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
            ctx.beginPath();
            ctx.moveTo(px1, py1);
            ctx.lineTo(px2, py2);
            ctx.stroke();

            const s1 = 4 * scale1;
            const s2 = 4 * scale2;

            ctx.fillStyle = config.color.value;

            ctx.globalAlpha = Math.max(0.2, scale1 * 0.8);
            ctx.beginPath();
            ctx.arc(px1, py1, s1, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = Math.max(0.2, scale2 * 0.8);
            ctx.beginPath();
            ctx.arc(px2, py2, s2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function animate() {
        angle += config.speed.value;
        draw();
        animationId = requestAnimationFrame(animate);
    }

    if (!isDark && config.color.value === '#38bdf8') config.color.value = '#0284c7';
    if (isDark && config.color.value === '#0284c7') config.color.value = '#38bdf8';

    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            mouse.x = w / 2; mouse.y = h / 2;
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#38bdf8' : '#0284c7';
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
