
export const config = {
    radius: { type: 'range', min: 50, max: 400, value: 200, label: 'Radius' },
    density: { type: 'range', min: 10, max: 50, value: 20, label: 'Grid Density' },
    width: { type: 'range', min: 0.5, max: 5, step: 0.5, value: 1.5, label: 'Line Width' },
    speed: { type: 'range', min: 0, max: 0.1, step: 0.001, value: 0.01, label: 'Auto Rotation' },
    color: { type: 'color', value: '#c084fc', label: 'Wire Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;

    let rotation = { x: 0, y: 0 };
    const mouse = { x: width / 2, y: height / 2 };

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        rotation.y += config.speed.value;
        rotation.x += config.speed.value * 0.5;

        const tiltX = (mouse.y - height / 2) * 0.002;
        const tiltY = (mouse.x - width / 2) * 0.002;

        const cx = width / 2;
        const cy = height / 2;
        const r = config.radius.value;
        const steps = config.density.value;

        ctx.strokeStyle = config.color.value;
        ctx.lineWidth = config.width.value;

        for (let i = 0; i < steps; i++) {
            const phi = (i / steps) * Math.PI;
            const y = r * Math.cos(phi);
            const ringR = r * Math.sin(phi);

            drawRing(cx, cy, ringR, y, rotation.x + tiltX, rotation.y + tiltY);
        }

        // Vertical rings
        // To draw vertical rings, we can just rotate our drawing frame by 90deg?
        // Or swap coordinates. 
        // Let's implement full sphere grid points for cleaner look if requested?
        // User asked for "Line Width" update mostly.
        // Let's keep existing logic but apply line width.

        // Adding the vertical meridians manually to make it a "Globe"
        for (let i = 0; i < steps; i++) {
            // For each longitude
            const theta = (i / steps) * Math.PI;
            // We can draw a ring that is rotated 90deg on Z axis before other rotations?
            // Actually, meridians are circles passing through poles.
            // They are just circles in YZ plane rotated around Y.
            drawMeridian(cx, cy, r, theta, rotation.x + tiltX, rotation.y + tiltY);
        }
    }

    function drawRing(cx, cy, r, yPos, angleX, angleY) {
        ctx.beginPath();
        let first = true;
        const segments = 40;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            let x = r * Math.cos(theta);
            let z = r * Math.sin(theta);
            let y = yPos;

            // X Rot
            let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
            let z1 = z * Math.cos(angleX) + y * Math.sin(angleX);

            // Y Rot
            let x2 = x * Math.cos(angleY) - z1 * Math.sin(angleY);
            let z2 = z1 * Math.cos(angleY) + x * Math.sin(angleY);

            const scale = 500 / (500 + z2);
            const px = cx + x2 * scale;
            const py = cy + y1 * scale;

            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
        }
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function drawMeridian(cx, cy, r, longitudeAngle, angleX, angleY) {
        // Meridian circle is on Y plane, rotated by longitudeAngle around Y axis locally
        // Then global rotated
        ctx.beginPath();
        let first = true;
        const segments = 40;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            // Circle in XY plane
            let x = r * Math.sin(theta);
            let y = r * Math.cos(theta);
            let z = 0;

            // Rotate to longitude
            // Actually it's cleaner to generate circle in YZ plane and rotate?

            // Let's simplify: Meridian is a circle of radius R.
            // It goes through poles (0, R, 0) and (0, -R, 0).
            // Parametric: x = R sin(t) cos(long), y = R cos(t), z = R sin(t) sin(long)

            let xx = r * Math.sin(theta) * Math.cos(longitudeAngle);
            let yy = r * Math.cos(theta);
            let zz = r * Math.sin(theta) * Math.sin(longitudeAngle);

            // Global Rotations
            let y1 = yy * Math.cos(angleX) - zz * Math.sin(angleX);
            let z1 = zz * Math.cos(angleX) + yy * Math.sin(angleX);

            let x2 = xx * Math.cos(angleY) - z1 * Math.sin(angleY);
            let z2 = z1 * Math.cos(angleY) + xx * Math.sin(angleY);

            const scale = 500 / (500 + z2);
            const px = cx + x2 * scale;
            const py = cy + y1 * scale;

            if (first) { ctx.moveTo(px, py); first = false; }
            else ctx.lineTo(px, py);
        }
        ctx.globalAlpha = 0.3; // fainter meridians
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    animate();

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
            config.color.value = dark ? '#c084fc' : '#a855f7';
        },
        updateConfig(key, val) {
            // instant
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
