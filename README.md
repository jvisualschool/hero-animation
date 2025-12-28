# 🎨 Hero Section Animations Gallery

> 16가지 인터랙티브 히어로 섹션 배경 애니메이션 컬렉션

**Live Demo**: [https://jvibeschool.org/HERO_BG/](https://jvibeschool.org/HERO_BG/)

---

## 📋 프로젝트 개요

웹사이트의 히어로 섹션(Hero Section)에 적용할 수 있는 16가지 고품질 Canvas 기반 애니메이션을 제공하는 갤러리입니다. 모든 애니메이션은 **순수 JavaScript**로 구현되어 외부 라이브러리 의존성 없이 가볍고 빠르게 동작합니다.

### ✨ 주요 특징

| 특징 | 설명 |
|------|------|
| 🚀 **경량** | 외부 라이브러리 없이 Vanilla JS로 구현 |
| 🎛️ **커스터마이징** | 속도, 색상, 크기 등 실시간 조절 가능 |
| 🖱️ **인터랙티브** | 마우스 움직임에 반응하는 애니메이션 |
| 🌙 **테마 지원** | 다크/라이트 모드 자동 전환 |
| 📱 **반응형** | 모든 화면 크기에 최적화 |
| 📋 **코드 복사** | 원클릭으로 독립 실행 코드 복사 |

---

## 🛠️ 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - CSS Variables, Flexbox, Grid, 3D Transforms
- **JavaScript (ES6+)** - ES Modules, async/await, Canvas API

### Canvas API 활용
```javascript
// 기본 애니메이션 루프 패턴
function animate(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 렌더링 로직
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

### 주요 기술 요소
| 기술 | 용도 |
|------|------|
| `requestAnimationFrame` | 프레임레이트 독립적 애니메이션 |
| `deltaTime` 패턴 | 고주사율 모니터(120Hz+) 호환 |
| ES Modules | 모듈화된 애니메이션 코드 관리 |
| CSS Variables | 다크/라이트 테마 동적 전환 |
| IntersectionObserver | 갤러리 레이지 로딩 최적화 |

---

## 📁 프로젝트 구조

```
HERO_BG/
├── index.html              # 메인 갤러리 페이지
├── {animation}.html        # 16개 개별 애니메이션 페이지
├── generate_pages.js       # 페이지 자동 생성 스크립트
├── deploy.sh               # 배포 스크립트
├── README.md               # 프로젝트 문서
│
├── css/
│   ├── style.css           # 앱 공통 스타일
│   └── gallery.css         # 갤러리 전용 스타일
│
└── js/
    ├── app.js              # 메인 애플리케이션 로직
    └── animations/         # 16개 애니메이션 모듈
        ├── aurora.js
        ├── particles.js
        ├── blobs.js
        ├── constellation.js
        ├── warp.js
        ├── swirl.js
        ├── dna.js
        ├── fireflies.js
        ├── flowfield.js
        ├── neural.js
        ├── cubes.js
        ├── tunnel.js
        ├── sphere.js
        ├── holographic.js
        ├── mesh.js
        └── matrix_rain.js
```

---

## 🎬 애니메이션 목록

| # | 이름 | 영문 | 설명 |
|---|------|------|------|
| 1 | 인터랙티브 파티클 | Interactive Particles | 마우스에 반응하는 연결된 점들 |
| 2 | 별자리 | Constellation | 신비로운 선으로 연결된 노드들 |
| 3 | 워프 스피드 | Warp Speed | 우주 고속 여행 효과 |
| 4 | 은하수 소용돌이 | Galactic Swirl | 중심으로 빨려드는 입자들 |
| 5 | DNA 나선 | DNA Helix | 회전하는 3D 이중 나선 |
| 6 | 오로라 | Aurora Borealis | 북극광 메시 그라디언트 |
| 7 | 반딧불이 | Fireflies | 밤하늘의 반짝이는 입자들 |
| 8 | 플로우 필드 | Flow Field | 힘의 장을 따라 흐르는 입자 |
| 9 | 신경망 | Neural Network | 신호가 전달되는 신경 경로 |
| 10 | 3D 큐브 필드 | 3D Cube Field | 회전하는 와이어프레임 큐브 |
| 11 | 무한 터널 | Infinite Tunnel | 다가오는 3D 터널 |
| 12 | 모핑 블롭 | Morphing Blobs | 유기적으로 변형되는 도형 |
| 13 | 와이어프레임 구체 | Wireframe Sphere | 회전하는 3D 지구본 |
| 14 | 홀로그램 웨이브 | Holographic Waves | 미래적인 스캔라인 |
| 15 | 그라디언트 메시 | Gradient Mesh | 부유하는 블러 블롭 |
| 16 | 매트릭스 레인 | Matrix Rain | 디지털 코드 비 |

---

## 🚀 사용 방법

### 1. 갤러리에서 선택
1. [메인 갤러리](https://jvibeschool.org/HERO_BG/)에서 원하는 애니메이션 클릭
2. 우측 패널에서 설정 조절 (속도, 색상, 크기 등)
3. **"소스 코드 복사"** 버튼 클릭
4. 복사된 HTML 코드를 프로젝트에 붙여넣기

### 2. 직접 임포트
```html
<canvas id="hero-canvas"></canvas>
<script type="module">
    import { init } from './js/animations/aurora.js';
    
    const canvas = document.getElementById('hero-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const instance = init(canvas, true); // true = 다크모드
    
    // 설정 변경
    instance.updateConfig('speed', 0.5);
    
    // 마우스 연동
    window.addEventListener('mousemove', (e) => {
        instance.mousemove(e.clientX, e.clientY);
    });
    
    // 리사이즈 처리
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        instance.resize(canvas.width, canvas.height);
    });
</script>
```

### 3. 모듈 API

각 애니메이션 모듈은 다음 인터페이스를 제공합니다:

```javascript
// 초기화
const instance = init(canvas, isDarkMode);

// 메서드
instance.cleanup();                    // 애니메이션 정리
instance.resize(width, height);        // 캔버스 리사이즈
instance.mousemove(x, y);              // 마우스 위치 업데이트
instance.setTheme(isDark);             // 테마 변경
instance.updateConfig(key, value);     // 설정 변경

// 설정 객체 (모듈별 상이)
export const config = {
    speed: { type: 'range', min: 0.1, max: 2, value: 1 },
    color: { type: 'color', value: '#00d4ff' },
    // ...
};
```

---

## ⚡ 성능 최적화

### 적용된 최적화 기법

1. **DeltaTime 기반 애니메이션**
   - 프레임레이트 독립적 움직임
   - 60Hz, 120Hz, 144Hz 모니터에서 동일한 속도

2. **IntersectionObserver 레이지 로딩**
   - 화면에 보이는 카드만 애니메이션 실행
   - 스크롤 시 자동 활성화/비활성화

3. **Object Pooling**
   - 파티클 재사용으로 가비지 컬렉션 최소화

4. **Canvas 최적화**
   - `willReadFrequently: false` 설정
   - 불필요한 상태 저장/복원 제거

---

## 🎨 커스터마이징

### 테마 색상 변경 (CSS Variables)
```css
:root {
    --accent: #667eea;        /* 메인 강조색 */
    --bg-primary: #ffffff;    /* 배경색 */
    --text-primary: #1a1a1a;  /* 텍스트 색상 */
}

[data-theme="dark"] {
    --accent: #00d4ff;
    --bg-primary: #0f0f0f;
    --text-primary: #ffffff;
}
```

### 애니메이션 기본값 변경
```javascript
// js/animations/particles.js
export const config = {
    count: { type: 'range', min: 50, max: 500, value: 150 },  // 기본값 수정
    speed: { type: 'range', min: 0.1, max: 3, value: 1 },
    // ...
};
```

---

## 📱 브라우저 지원

| 브라우저 | 최소 버전 |
|----------|-----------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |
| iOS Safari | 14+ |
| Android Chrome | 80+ |

---

## 📄 라이선스

MIT License © 2026 Jinho Jung

자유롭게 사용, 수정, 배포가 가능합니다.

---

## 🔗 링크

- **Live Demo**: [https://jvibeschool.org/HERO_BG/](https://jvibeschool.org/HERO_BG/)
- **Author**: Jinho Jung
- **Website**: [jvibeschool.com](https://jvibeschool.com)

---

## 🙏 기여

버그 리포트, 기능 제안, PR 모두 환영합니다!

```bash
# 로컬 개발
git clone https://github.com/your-repo/hero-bg.git
cd hero-bg
# 로컬 서버 실행 (예: Live Server)
```

---

**Made with ❤️ by Jinho Jung**
