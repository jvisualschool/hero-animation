
export const config = {
    waveCount: { type: 'range', min: 5, max: 30, value: 15, label: 'Wave Count' },
    speed: { type: 'range', min: 0.1, max: 5, value: 1, label: 'Speed' },
    amplitude: { type: 'range', min: 10, max: 100, value: 50, label: 'Height' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let time = 0;

    // Mouse interaction for wave disturbance
    const mouse = { x: -1000, y: -1000 };

    function draw() {
        const bg = isDark ? '#000000' : '#ffecd2'; // Custom BG from source
        // Actually, let's respect the user's generic theme colors if possible, 
        // but the source had specific gradients:
        // Light: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)
        // Dark: linear-gradient(135deg, #000000 0%, #434343 100%)

        // Let's replicate that gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        if (isDark) {
            gradient.addColorStop(0, '#000000');
            gradient.addColorStop(1, '#434343');
        } else {
            gradient.addColorStop(0, '#ffecd2');
            gradient.addColorStop(1, '#fcb69f');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        const centerY = height / 2;
        const count = config.waveCount.value;

        for (let i = 0; i < count; i++) {
            const offset = i * 30;
            const wavePhase = time * 0.001 * config.speed.value + i * 0.3;

            ctx.beginPath();

            for (let x = 0; x <= width; x += 5) {
                // Mouse influence
                const dist = Math.abs(x - mouse.x);
                const mouseEffect = Math.max(0, (1 - dist / 300) * 50); // lift near mouse

                const y = centerY +
                    Math.sin(x * 0.01 + wavePhase) * config.amplitude.value +
                    Math.sin(x * 0.02 + wavePhase * 1.5) * (config.amplitude.value * 0.6) +
                    offset - (count * 15) + (mouseEffect * Math.sin(time * 0.005));

                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            const opacity = (Math.sin(wavePhase) + 1) / 2 * 0.6 + 0.2;

            if (isDark) {
                const hue = 180 + (i * 10);
                ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${hue}, 100%, 70%, ${opacity})`;
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                const hue = 20 + (i * 10);
                ctx.strokeStyle = `hsla(${hue}, 70%, 50%, ${opacity})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        // Scanlines
        ctx.fillStyle = isDark ? 'rgba(0, 255, 255, 0.02)' : 'rgba(93, 78, 55, 0.02)';
        for (let i = 0; i < height; i += 4) {
            ctx.fillRect(0, i, width, 2);
        }
    }

    let lastTime = 0;
    function animate(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        time += deltaTime;
        draw();
        animationId = requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

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
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
