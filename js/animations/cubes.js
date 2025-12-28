
export const config = {
    count: { type: 'range', min: 10, max: 200, value: 50, label: 'Cube Count' },
    speed: { type: 'range', min: 0.1, max: 3, step: 0.1, value: 1, label: 'Rotation Speed' },
    spread: { type: 'range', min: 100, max: 1000, value: 500, label: 'Field Size' },
    color: { type: 'color', value: '#38bdf8', label: 'Cube Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;
    let cubes = [];

    // Mouse
    const mouse = { x: width / 2, y: height / 2 };

    class Cube {
        constructor() {
            this.init();
        }

        init() {
            this.x = (Math.random() - 0.5) * config.spread.value;
            this.y = (Math.random() - 0.5) * config.spread.value;
            this.z = (Math.random() - 0.5) * config.spread.value;
            this.size = Math.random() * 20 + 20;
            this.rx = Math.random() * Math.PI;
            this.ry = Math.random() * Math.PI;
        }

        getVertices(s) {
            return [
                [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
                [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
            ];
        }

        project(angleX, angleY) {
            // Apply global rotation to position
            let x1 = this.x * Math.cos(angleY) - this.z * Math.sin(angleY);
            let z1 = this.z * Math.cos(angleY) + this.x * Math.sin(angleY);
            let y1 = this.y * Math.cos(angleX) - z1 * Math.sin(angleX);
            let z2 = z1 * Math.cos(angleX) + this.y * Math.sin(angleX);

            // Calculate scale
            const scale = 600 / (600 + z2 + 800);

            const cx = width / 2 + x1 * scale;
            const cy = height / 2 + y1 * scale;

            // Now rotate vertices OF the cube
            // We apply the same scene rotation to the vertices so they align with the world
            const s = this.size / 2;
            const verts = this.getVertices(s).map(v => {
                let vx = v[0]; let vy = v[1]; let vz = v[2];

                // Rotate vertex around Y then X
                let px = vx * Math.cos(angleY) - vz * Math.sin(angleY);
                let pz = vz * Math.cos(angleY) + vx * Math.sin(angleY);

                let py = vy * Math.cos(angleX) - pz * Math.sin(angleX);
                let pz2 = pz * Math.cos(angleX) + vy * Math.sin(angleX);

                // Add to projected center
                // Note: True 3D projection would add coords THEN project.
                // But for "floating cubes" having them keep perspective locally is fine?
                // Actually let's do correct world space.

                // World position of vertex
                let wx = x1 + px;
                let wy = y1 + py;
                let wz = z2 + pz2;

                const vScale = 600 / (600 + wz + 800);

                return {
                    x: width / 2 + wx * vScale,
                    y: height / 2 + wy * vScale
                };
            });

            return {
                verts: verts,
                z: z2
            };
        }
    }

    function initCubes() {
        cubes = [];
        for (let i = 0; i < config.count.value; i++) {
            cubes.push(new Cube());
        }
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const angleY = (mouse.x - width / 2) * 0.001 * config.speed.value + performance.now() * 0.0002 * config.speed.value;
        const angleX = (mouse.y - height / 2) * 0.001 * config.speed.value;

        // Project
        const projected = cubes.map(c => c.project(angleX, angleY));

        projected.sort((a, b) => b.z - a.z);

        ctx.strokeStyle = config.color.value;
        ctx.lineWidth = 1;

        const edges = [
            [0, 1], [1, 2], [2, 3], [3, 0],
            [4, 5], [5, 6], [6, 7], [7, 4],
            [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        projected.forEach(p => {
            ctx.beginPath();
            edges.forEach(e => {
                const v1 = p.verts[e[0]];
                const v2 = p.verts[e[1]];
                ctx.moveTo(v1.x, v1.y);
                ctx.lineTo(v2.x, v2.y);
            });
            ctx.stroke();

            // Fill faces
            ctx.fillStyle = config.color.value + '15'; // low alpha

            // Top
            ctx.beginPath();
            [0, 1, 2, 3].forEach(i => ctx.lineTo(p.verts[i].x, p.verts[i].y));
            ctx.fill();

            // Bottom
            ctx.beginPath();
            [4, 5, 6, 7].forEach(i => ctx.lineTo(p.verts[i].x, p.verts[i].y));
            ctx.fill();
        });

        animationId = requestAnimationFrame(draw);
    }

    initCubes();
    draw();

    return {
        resize(w, h) {
            width = w;
            height = h;
            mouse.x = w / 2; mouse.y = h / 2;
            initCubes();
        },
        mousemove(x, y) {
            mouse.x = x;
            mouse.y = y;
        },
        setTheme(dark) {
            isDark = dark;
            config.color.value = dark ? '#38bdf8' : '#0284c7';
        },
        updateConfig(key, value) {
            if (key === 'count') initCubes();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
