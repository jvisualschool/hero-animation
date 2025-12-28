
export const config = {
    count: { type: 'range', min: 20, max: 200, value: 80, label: 'Node Count' },
    speed: { type: 'range', min: 0.001, max: 0.02, step: 0.001, value: 0.002, label: 'Rotation Speed' },
    radius: { type: 'range', min: 100, max: 500, value: 300, label: 'Radius' },
    width: { type: 'range', min: 0.1, max: 3, step: 0.1, value: 1, label: 'Line Width' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let angle = 0;

    // Mouse Interaction
    const mouse = { x: width / 2, y: height / 2 };

    let points = [];

    function initPoints() {
        points = [];
        for (let i = 0; i < config.count.value; i++) {
            const theta = Math.acos(2 * Math.random() - 1);
            const phi = Math.sqrt(config.count.value * Math.PI) * theta;
            const r = config.radius.value;
            points.push({
                x: r * Math.sin(theta) * Math.cos(phi),
                y: r * Math.sin(theta) * Math.sin(phi),
                z: r * Math.cos(theta)
            });
        }
    }

    function project(p, width, height) {
        const mx = (mouse.x - width / 2) * 0.0001;
        const my = (mouse.y - height / 2) * 0.0001;

        const cosY = Math.cos(angle + mx);
        const sinY = Math.sin(angle + mx);
        const cosX = Math.cos(my);
        const sinX = Math.sin(my);

        // Rotate Y
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y;

        // Rotate X
        let y1 = y * cosX - z * sinX;
        let z1 = z * cosX + y * sinX;

        const scale = 500 / (500 + z1 + config.radius.value + 100);

        return {
            x: width / 2 + x * scale,
            y: height / 2 + y1 * scale,
            z: z1,
            scale: scale
        };
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        const pointColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
        const lineColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const projected = points.map(p => project(p, width, height));

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = config.width.value;

        ctx.beginPath();
        for (let i = 0; i < projected.length; i++) {
            for (let j = i + 1; j < projected.length; j++) {
                const p1 = projected[i];
                const p2 = projected[j];
                const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

                if (dist < 60) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }
        }
        ctx.stroke();

        projected.forEach(p => {
            const size = 2 * p.scale;
            const alpha = (p.z + config.radius.value) / (2 * config.radius.value);
            const finalAlpha = Math.max(0.1, Math.min(1, alpha));

            ctx.fillStyle = pointColor.replace('0.8)', `${finalAlpha * 0.8})`);
            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function animate() {
        angle += config.speed.value;
        draw();
        animationId = requestAnimationFrame(animate);
    }

    initPoints();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initPoints(); // Recalculate if radius logic depended on w/h (config doesn't but safe)
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
        },
        updateConfig(key, val) {
            if (key === 'count' || key === 'radius') initPoints();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
