
export const config = {
    count: { type: 'range', min: 1, max: 6, value: 3, label: 'Blob Count' },
    speed: { type: 'range', min: 0.1, max: 2, step: 0.1, value: 1, label: 'Speed' },
    size: { type: 'range', min: 100, max: 400, value: 180, label: 'Size' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let time = 0;

    // Mouse Influence
    const mouse = { x: width / 2, y: height / 2 };

    const blobs = [];
    const colors = ['rgba(236, 72, 153, 0.6)', 'rgba(56, 189, 248, 0.6)', 'rgba(167, 243, 208, 0.6)', 'rgba(250, 204, 21, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(244, 63, 94, 0.6)'];

    function initBlobs() {
        blobs.length = 0;
        for (let i = 0; i < config.count.value; i++) {
            blobs.push({
                x: Math.random() * width,
                y: Math.random() * height,
                offset: Math.random() * 1000,
                color: colors[i % colors.length]
            });
        }
    }

    function updateBlobs() {
        blobs.forEach((b, i) => {
            const t = time * config.speed.value + b.offset;
            // Lissajous movement
            const targetX = width / 2 + Math.sin(t * 0.002) * (width * 0.3);
            const targetY = height / 2 + Math.cos(t * 0.003) * (height * 0.3);

            // Mouse attraction (weak)
            b.x = targetX + (mouse.x - width / 2) * 0.1;
            b.y = targetY + (mouse.y - height / 2) * 0.1;

            b.r = config.size.value + Math.sin(t * 0.005) * 50;
        });
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = isDark ? 'screen' : 'multiply';
        ctx.filter = 'blur(60px)';

        blobs.forEach(b => {
            ctx.fillStyle = b.color;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.filter = 'none';
        ctx.globalCompositeOperation = 'source-over';
    }

    function animate() {
        time += 5;
        updateBlobs();
        draw();
        animationId = requestAnimationFrame(animate);
    }

    initBlobs();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initBlobs();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            // Could update colors opacity here
        },
        updateConfig(key, val) {
            if (key === 'count') initBlobs();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
