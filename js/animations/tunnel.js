
export const config = {
    speed: { type: 'range', min: 0.1, max: 2, step: 0.1, value: 0.5, label: 'Speed' },
    density: { type: 'range', min: 10, max: 100, value: 40, label: 'Section Density' },
    width: { type: 'range', min: 0.5, max: 5, step: 0.5, value: 2, label: 'Line Width' },
    shapes: { type: 'select', options: ['Square', 'Circle', 'Triangle', 'Pentagon', 'Hexagon', 'Octagon', 'Star', 'Diamond'], value: 'Square', label: 'Shape' },
    color: { type: 'color', value: '#818cf8', label: 'Neon Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;

    let segments = [];
    const maxZ = 2000;

    const mouse = { x: width / 2, y: height / 2 };

    function initSegments() {
        segments = [];
        const count = 50;
        for (let i = 0; i < count; i++) {
            segments.push({
                z: i * (maxZ / count),
                angle: 0
            });
        }
    }

    function drawPolygon(x, y, radius, sides, rotation) {
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const theta = (i / sides) * 2 * Math.PI + rotation;
            const px = x + radius * Math.cos(theta);
            const py = y + radius * Math.sin(theta);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function drawStar(x, y, radius, rotation) {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? radius : radius / 2;
            const theta = (i / 10) * 2 * Math.PI + rotation - Math.PI / 2;
            const px = x + r * Math.cos(theta);
            const py = y + r * Math.sin(theta);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }

    function drawDiamond(x, y, size, rotation) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation + Math.PI / 4);
        ctx.beginPath();
        ctx.rect(-size / 2, -size / 2, size, size);
        ctx.stroke();
        ctx.restore();
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const cx = width / 2;
        const cy = height / 2;

        const mx = (mouse.x - width / 2) * 0.5;
        const my = (mouse.y - height / 2) * 0.5;

        segments.forEach((seg, i) => {
            seg.z -= config.speed.value;
            if (seg.z <= 0) seg.z += maxZ;

            const scale = 300 / (seg.z + 100);
            const x = cx + mx * (1 - scale);
            const y = cy + my * (1 - scale);
            const rotation = seg.z * 0.001;

            ctx.strokeStyle = config.color.value;
            const alpha = Math.min(1, 300 / seg.z);
            ctx.globalAlpha = alpha;
            ctx.lineWidth = config.width.value * scale;

            const baseSize = 150 * scale;

            switch (config.shapes.value) {
                case 'Square':
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rotation);
                    ctx.strokeRect(-baseSize, -baseSize, baseSize * 2, baseSize * 2);
                    ctx.restore();
                    break;
                case 'Circle':
                    ctx.beginPath();
                    ctx.arc(x, y, baseSize, 0, Math.PI * 2);
                    ctx.stroke();
                    break;
                case 'Triangle': drawPolygon(x, y, baseSize * 1.2, 3, rotation - Math.PI / 2); break;
                case 'Pentagon': drawPolygon(x, y, baseSize, 5, rotation - Math.PI / 2); break;
                case 'Hexagon': drawPolygon(x, y, baseSize, 6, rotation - Math.PI / 2); break;
                case 'Octagon': drawPolygon(x, y, baseSize, 8, rotation - Math.PI / 8); break;
                case 'Star': drawStar(x, y, baseSize * 1.2, rotation); break;
                case 'Diamond': drawDiamond(x, y, baseSize * 2, rotation); break;
                default:
                    ctx.strokeRect(x - baseSize, y - baseSize, baseSize * 2, baseSize * 2);
            }
        });
        ctx.globalAlpha = 1;

        animationId = requestAnimationFrame(draw);
    }

    initSegments();
    draw();

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
            config.color.value = dark ? '#818cf8' : '#6366f1';
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
