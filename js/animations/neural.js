
export const config = {
    count: { type: 'range', min: 20, max: 80, value: 40, label: 'Node Count' },
    pulseSpeed: { type: 'range', min: 0.01, max: 0.1, step: 0.01, value: 0.05, label: 'Pulse Speed' },
    nodeSize: { type: 'range', min: 1, max: 10, step: 0.5, value: 3, label: 'Node Size' },
    color: { type: 'color', value: '#38bdf8', label: 'Signal Color' }
};

export function init(canvas, isDark) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;
    let animationId;

    const nodes = [];
    const pulses = [];

    const mouse = { x: -1000, y: -1000 };
    const connectDist = 150;

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.baseSize = Math.random() * 0.5 + 0.5;
        }

        update() {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                this.x -= (dx / dist);
                this.y -= (dy / dist);
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            // config.nodeSize is base multiplier
            ctx.arc(this.x, this.y, this.baseSize * config.nodeSize.value, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Pulse {
        constructor(start, end) {
            this.start = start;
            this.end = end;
            this.progress = 0;
            this.dead = false;
        }

        update() {
            this.progress += config.pulseSpeed.value;
            if (this.progress >= 1) {
                this.dead = true;
                if (Math.random() > 0.5) triggerPulse(this.end);
            }
        }

        draw() {
            const x = this.start.x + (this.end.x - this.start.x) * this.progress;
            const y = this.start.y + (this.end.y - this.start.y) * this.progress;

            ctx.fillStyle = config.color.value;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();

            if (isDark) {
                ctx.shadowBlur = 5;
                ctx.shadowColor = config.color.value;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
    }

    function triggerPulse(fromNode) {
        const neighbors = nodes.filter(n => {
            if (n === fromNode) return false;
            const dx = n.x - fromNode.x;
            const dy = n.y - fromNode.y;
            return (dx * dx + dy * dy) < (connectDist * connectDist);
        });

        if (neighbors.length > 0) {
            const target = neighbors[Math.floor(Math.random() * neighbors.length)];
            pulses.push(new Pulse(fromNode, target));
        }
    }

    function initNetwork() {
        nodes.length = 0;
        pulses.length = 0;
        for (let i = 0; i < config.count.value; i++) {
            nodes.push(new Node());
        }
        for (let i = 0; i < 5; i++) {
            triggerPulse(nodes[Math.floor(Math.random() * nodes.length)]);
        }
    }

    function draw() {
        const bg = isDark ? '#0f172a' : '#f8fafc';
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, width, height);

        const lineColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const distSq = (n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2;
                if (distSq < connectDist ** 2) {
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                }
            }
        }
        ctx.stroke();

        nodes.forEach(n => {
            n.update();
            n.draw();
        });

        for (let i = pulses.length - 1; i >= 0; i--) {
            const p = pulses[i];
            p.update();
            p.draw();
            if (p.dead) pulses.splice(i, 1);
        }

        if (Math.random() > 0.95 && pulses.length < 20) {
            triggerPulse(nodes[Math.floor(Math.random() * nodes.length)]);
        }
    }

    function animate() {
        draw();
        animationId = requestAnimationFrame(animate);
    }

    if (isDark && config.color.value === '#0284c7') config.color.value = '#38bdf8';
    if (!isDark && config.color.value === '#38bdf8') config.color.value = '#0284c7';

    initNetwork();
    animate();

    return {
        resize(w, h) {
            width = w;
            height = h;
            initNetwork();
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
            if (key === 'count') initNetwork();
        },
        cleanup() {
            cancelAnimationFrame(animationId);
        }
    };
}
