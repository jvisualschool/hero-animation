// ==================== Global Variables ====================
let currentAnimationFile = '';
let currentAnimationTitle = '';

// ==================== Theme Management ====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// ==================== Gallery Management ====================
function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    
    animations.forEach(animation => {
        const card = createAnimationCard(animation);
        galleryGrid.appendChild(card);
    });
}

function createAnimationCard(animation) {
    const card = document.createElement('div');
    card.className = 'animation-card';
    card.onclick = () => openPreview(animation.file, animation.title);
    
    card.innerHTML = `
        <div class="card-preview">
            <iframe src="${animation.file}" loading="lazy"></iframe>
            <div class="card-overlay">
                <div class="card-overlay-content">
                    <i class="fas fa-eye"></i>
                    <p>미리보기</p>
                </div>
            </div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${animation.title}</h3>
            <p class="card-description">${animation.description}</p>
            <div class="card-tags">
                ${animation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="event.stopPropagation(); openPreview('${animation.file}', '${animation.title}')">
                    <i class="fas fa-play"></i>
                    미리보기
                </button>
                <button class="btn btn-secondary" onclick="event.stopPropagation(); copyCodeDirect('${animation.file}')">
                    <i class="fas fa-copy"></i>
                    코드 복사
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// ==================== Modal Management ====================
function openPreview(file, title) {
    currentAnimationFile = file;
    currentAnimationTitle = title;
    
    const modal = document.getElementById('previewModal');
    const modalTitle = document.getElementById('modalTitle');
    const previewFrame = document.getElementById('previewFrame');
    
    modalTitle.textContent = title;
    previewFrame.src = file;
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('previewModal');
    const previewFrame = document.getElementById('previewFrame');
    
    modal.classList.remove('active');
    previewFrame.src = '';
    
    // Restore body scroll
    document.body.style.overflow = '';
}

function openFullscreen() {
    window.open(currentAnimationFile, '_blank');
}

// ==================== Code Copy Management ====================
async function copyCode() {
    await copyCodeDirect(currentAnimationFile);
}

async function copyCodeDirect(file) {
    try {
        const response = await fetch(file);
        const code = await response.text();
        
        await navigator.clipboard.writeText(code);
        showToast('코드가 클립보드에 복사되었습니다!');
    } catch (error) {
        console.error('Error copying code:', error);
        showToast('코드 복사 중 오류가 발생했습니다.', 'error');
    }
}

// ==================== Toast Notification ====================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const icon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== Keyboard Shortcuts ====================
document.addEventListener('keydown', (e) => {
    // ESC to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('previewModal');
        if (modal.classList.contains('active')) {
            closeModal();
        }
    }
    
    // Ctrl/Cmd + C to copy code when modal is open
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const modal = document.getElementById('previewModal');
        if (modal.classList.contains('active')) {
            e.preventDefault();
            copyCode();
        }
    }
    
    // Ctrl/Cmd + F to open fullscreen when modal is open
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        const modal = document.getElementById('previewModal');
        if (modal.classList.contains('active')) {
            e.preventDefault();
            openFullscreen();
        }
    }
});

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Setup theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Render gallery
    renderGallery();
    
    // Setup modal close on overlay click
    document.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    
    console.log('🎨 Hero Animations Gallery initialized successfully!');
    console.log('📊 Total animations:', animations.length);
});

// ==================== Smooth Scroll ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animation cards
setTimeout(() => {
    document.querySelectorAll('.animation-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}, 100);