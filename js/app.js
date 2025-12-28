
// Main Application Controller

const animations = [
    { id: 'aurora', name: '오로라', desc: '북극광을 연상시키는 부드럽게 흐르는 메시 그라디언트.' },
    { id: 'particles', name: '인터랙티브 파티클', desc: '마우스 커서 근처에서 연결되는 점들의 네트워크.' },
    { id: 'blobs', name: '모핑 블롭', desc: '합쳐지고 분리되는 유기적인 유동체 도형.' },
    { id: 'constellation', name: '별자리', desc: '신비로운 선으로 연결된 부유하는 노드들.' },
    { id: 'warp', name: '워프 스피드', desc: '별들 사이를 고속으로 여행하는 느낌.' },
    { id: 'swirl', name: '은하수 소용돌이', desc: '중심 소용돌이로 빨려 들어가는 입자들.' },
    { id: 'dna', name: 'DNA 나선', desc: '회전하는 3D 이중 나선 구조.' },
    { id: 'fireflies', name: '반딧불이', desc: '밤하늘에 불규칙하게 반짝이는 유기적인 입자들.' },
    { id: 'flowfield', name: '플로우 필드', desc: '보이지 않는 힘의 장을 따라 흐르는 입자들.' },
    { id: 'neural', name: '신경망', desc: '신호 펄스가 발사되는 시뮬레이션 신경 경로.' },
    // New 3D Effects
    { id: 'cubes', name: '3D 큐브 필드', desc: '마우스에 반응하여 회전하는 부유하는 3D 큐브들.' },
    { id: 'tunnel', name: '무한 터널', desc: '화면을 향해 다가오는 최면적인 3D 터널.' },
    { id: 'sphere', name: '와이어프레임 구체', desc: '회전하는 3D 지구 구조.' },
    { id: 'holographic', name: '홀로그램 웨이브', desc: '빛나는 미래지향적인 스캔 라인 웨이브.' },
    { id: 'mesh', name: '그라디언트 메시', desc: '메시 그라디언트를 생성하는 부드러운 부유 블롭.' },
    { id: 'matrix_rain', name: '매트릭스 레인', desc: '고전적인 디지털 코드 비 효과.' }
];

export class App {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentAnim = null;
        this.currentAnimInstance = null;
        this.isDark = document.documentElement.classList.contains('dark');

        this.ui = {
            list: document.getElementById('animation-list'),
            title: document.getElementById('anim-title'),
            desc: document.getElementById('anim-desc'),
            themeBtn: document.getElementById('theme-toggle'),
            copyBtn: document.getElementById('copy-code-btn'),
            modal: document.getElementById('code-modal'),
            codeBlock: document.getElementById('code-block'),
            closeModal: document.getElementById('close-modal'),
            confirmCopy: document.getElementById('confirm-copy'),
            settings: document.getElementById('settings-container')
        };

        // this.init(); // Explicitly called by instance owner
    }

    init(targetAnimId = null) {
        this.populateSidebar();
        this.setupEventListeners();
        this.resize();

        // Check if an explicit ID was passed (e.g., from inline script in single page)
        if (targetAnimId && animations.find(a => a.id === targetAnimId)) {
            this.loadAnimation(targetAnimId);
            return;
        }

        // Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const animId = urlParams.get('id');

        if (animId && animations.find(a => a.id === animId)) {
            this.loadAnimation(animId);
        } else {
            this.loadAnimation(animations[0].id);
        }
    }

    populateSidebar() {
        if (!this.ui.list) return; // Exit if no sidebar (single page mode)

        animations.forEach(anim => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.className = 'anim-btn';
            btn.textContent = anim.name;
            btn.dataset.id = anim.id;
            btn.onclick = () => this.loadAnimation(anim.id);
            li.appendChild(btn);
            this.ui.list.appendChild(li);
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            if (this.currentAnimInstance && this.currentAnimInstance.resize) {
                this.currentAnimInstance.resize(this.canvas.width, this.canvas.height);
            }
        });

        // Mouse Interaction
        window.addEventListener('mousemove', (e) => {
            if (this.currentAnimInstance && this.currentAnimInstance.mousemove) {
                const rect = this.canvas.getBoundingClientRect();
                this.currentAnimInstance.mousemove(e.clientX - rect.left, e.clientY - rect.top);
            }
        });

        this.ui.themeBtn.addEventListener('click', () => this.toggleTheme());

        this.ui.copyBtn.addEventListener('click', () => this.showCode());
        this.ui.closeModal.addEventListener('click', () => this.ui.modal.classList.add('hidden'));
        this.ui.confirmCopy.addEventListener('click', () => this.copyToClipboard());
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        document.documentElement.classList.toggle('dark', this.isDark);
        document.documentElement.classList.toggle('light', !this.isDark);

        // Update Button Icon
        if (this.ui.themeBtn) {
            const iconSpan = this.ui.themeBtn.querySelector('.icon') || this.ui.themeBtn;
            // Use unicode or font awesome? The HTML uses <span class="icon">◑</span>
            // Let's toggle between Sun ☀ and Moon ☾ or similar
            iconSpan.textContent = this.isDark ? '◑' : '☀';
        }

        if (this.currentAnimInstance && this.currentAnimInstance.setTheme) {
            this.currentAnimInstance.setTheme(this.isDark);
        }
    }

    async loadAnimation(id) {
        // Update UI
        document.querySelectorAll('.anim-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.anim-btn[data-id="${id}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        const animData = animations.find(a => a.id === id);
        this.ui.title.textContent = animData.name;
        this.ui.desc.textContent = animData.desc;
        this.currentAnim = animData;

        // Cleanup old animation
        if (this.currentAnimInstance && this.currentAnimInstance.cleanup) {
            this.currentAnimInstance.cleanup();
        }

        // Import new animation
        try {
            const module = await import(`./animations/${id}.js?v=${Date.now()}`); // Cache bust for dev

            // Build Settings UI
            this.buildSettings(module.config);

            this.currentAnimInstance = module.init(this.canvas, this.isDark);
        } catch (e) {
            console.error('Failed to load animation:', e);
            this.ui.settings.innerHTML = '<p class="no-settings">설정을 불러오는데 실패했습니다.</p>';
        }
    }

    buildSettings(config) {
        this.ui.settings.innerHTML = '';
        if (!config) {
            this.ui.settings.innerHTML = '<p class="no-settings">설정할 항목이 없습니다.</p>';
            return;
        }

        Object.entries(config).forEach(([key, schema]) => {
            const group = document.createElement('div');
            group.className = 'setting-group';

            const label = document.createElement('label');
            label.innerHTML = `${schema.label} <span class="value-display">${schema.value}</span>`;

            let input;
            if (schema.type === 'range') {
                input = document.createElement('input');
                input.type = 'range';
                input.min = schema.min;
                input.max = schema.max;
                input.step = schema.step || 1;
                input.value = schema.value;
            } else if (schema.type === 'color') {
                input = document.createElement('input');
                input.type = 'color';
                input.value = schema.value;
            } else if (schema.type === 'select') {
                input = document.createElement('select');
                schema.options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt;
                    option.textContent = opt;
                    if (opt === schema.value) option.selected = true;
                    input.appendChild(option);
                });
            } else if (schema.type === 'button') {
                input = document.createElement('button');
                input.className = 'text-btn';
                input.textContent = schema.label;
                input.style.width = '100%';
                input.style.marginTop = '0.5rem';
                input.onclick = () => {
                    if (this.currentAnimInstance && this.currentAnimInstance.updateConfig) {
                        this.currentAnimInstance.updateConfig(key, true);
                    }
                };
                // Skip default listener for button
                group.appendChild(input);
                this.ui.settings.appendChild(group);
                return;
            }

            // Event Listener
            input.addEventListener('input', (e) => {
                const val = schema.type === 'range' ? parseFloat(e.target.value) : e.target.value;
                if (schema.type !== 'color') {
                    label.querySelector('.value-display').textContent = val;
                }

                // Update Schema Value
                config[key].value = val;

                // Live Update
                if (this.currentAnimInstance && this.currentAnimInstance.updateConfig) {
                    this.currentAnimInstance.updateConfig(key, val);
                }
            });

            group.appendChild(label);
            group.appendChild(input);
            this.ui.settings.appendChild(group);
        });
    }

    async showCode() {
        if (!this.currentAnim) return;

        // Fetch source
        const response = await fetch(`js/animations/${this.currentAnim.id}.js`);
        let jsCode = await response.text();

        // We need to inject the CURRENT configuration values into the code
        // Simple heuristic: replace "value: X" in the config object definitions
        // But a cleaner way is to inject a "config override" block at the top of init

        // Get current config from module if possible, or we have modified the passed schema
        // Since we modified `module.config` object in place via reference in buildSettings, 
        // we can fetch it again or store it.
        // Actually, let's just use regex to replace default values if we want specific output.
        // OR better: Append a config rewrite line.

        /* 
           Strategy:
           The user wants the copied code to reflect their changes.
           The file has `export const config = { ... }`.
           We can replace the values in that text block using regex.
        */

        // Import module to get current values (they are modified in memory)
        const module = await import(`./animations/${this.currentAnim.id}.js?v=cachebust`);
        const currentConfig = module.config;

        if (currentConfig) {
            Object.entries(currentConfig).forEach(([key, schema]) => {
                // Regex to find: key: { ... value: <OLD>, ... }
                // This is hard to robustly regex.
                // Alternative: The copied code will include a `const customConfig = { ... }` block
                // and pass it to init.

                // Easier: Just string replace `value: default` with `value: current` for the *first match* inside the config block?
                // Risky.

                // Safe way: Reconstruct the config object string.
            });
        }

        // Let's try a simple approach:
        // Identify the `export const config = { ... };` block.
        // Replace it with the JSON stringified version of what we have (formatted).

        // 1. Remove export keywords
        let cleanCode = jsCode.replace(/export function init/, 'function init')
            .replace(/export const config/, 'const config');

        // 2. We want to update the `config` object literals in the text to match current values.
        // It's cleaner to just append initialization overrides at the END.
        // "instance.updateConfig('key', value);"

        let overrides = '';
        if (currentConfig) {
            overrides = '\n        // Apply user settings\n';
            Object.entries(currentConfig).forEach(([key, schema]) => {
                const val = typeof schema.value === 'string' ? `'${schema.value}'` : schema.value;
                overrides += `        instance.updateConfig('${key}', ${val});\n`;
            });
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.currentAnim.name}</title>
    <style>
        body { margin: 0; overflow: hidden; background: ${this.isDark ? '#0f172a' : '#f8fafc'}; }
        canvas { display: block; }
    </style>
</head>
<body>
    <canvas id="hero-canvas"></canvas>
    <script>
        ${cleanCode}

        // Initialization
        const canvas = document.getElementById('hero-canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const isDark = ${this.isDark};
        
        const instance = init(canvas, isDark);
        ${overrides}
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            if (instance.resize) instance.resize(canvas.width, canvas.height);
        });
        
        window.addEventListener('mousemove', (e) => {
            if (instance.mousemove) instance.mousemove(e.clientX, e.clientY);
        });
    </script>
</body>
</html>`;

        this.ui.codeBlock.textContent = html;
        this.ui.modal.classList.remove('hidden');
    }

    copyToClipboard() {
        const code = this.ui.codeBlock.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const btn = this.ui.confirmCopy;
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => btn.textContent = originalText, 2000);
        });
    }
}
