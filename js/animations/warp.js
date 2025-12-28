
export const config = {
    count: { type: 'range', min: 100, max: 1000, value: 400, label: 'Star Count' },
    // Reduced speed min from 1 to 0.1, current val 2 -> 0.2? User said 1/10th globally
    speed: { type: 'range', min: 0.1, max: 20, step: 0.1, value: 0.5, label: 'Warp Speed' },
    color: { type: 'color', value: '#ffffff', label: 'Star Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;

    // Mouse for steering
    const mouse = { x: width / 2, y: height / 2 };

    let stars = [];

    function initStars() {
        stars = [];
        for (let i = 0; i < config.count.value; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: Math.random() * width
            });
        }
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = config.color.value;

        const cx = width / 2 + (width / 2 - mouse.x) * 0.5;
        const cy = height / 2 + (height / 2 - mouse.y) * 0.5;

        stars.forEach(star => {
            star.z -= config.speed.value;
            if (star.z <= 0) {
                star.z = width;
                star.x = (Math.random() - 0.5) * width * 2;
                star.y = (Math.random() - 0.5) * height * 2;
            }

            const scale = 200 / star.z;
            const screenX = cx + star.x * scale;
            const screenY = cy + star.y * scale;

            const size = Math.max(0.5, (1 - star.z / width) * 3);

            if (screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
                ctx.beginPath();
                ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    if (!isDark && config.color.value === '#ffffff') config.color.value = '#000000';

    initStars();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initStars();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#ffffff' : '#000000';
        },
        updateConfig(key, val) {
            if (key === 'count') initStars();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
