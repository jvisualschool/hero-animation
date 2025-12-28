# 🎨 Hero Section Animations Gallery

10가지 멋진 웹 기반 히어로 섹션 애니메이션 컬렉션입니다. 모든 애니메이션은 다크/라이트 모드를 지원하며, 순수 HTML, CSS, JavaScript로 구현되어 있어 프레임워크 없이 바로 사용할 수 있습니다.

## ✨ 주요 기능

- 🌓 **다크/라이트 모드**: 모든 애니메이션은 테마 토글 기능 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 화면 크기에 최적화
- 🎯 **순수 구현**: 프레임워크 없이 순수 HTML/CSS/JavaScript로 구현
- 📋 **코드 복사**: 원클릭으로 전체 코드 복사 가능
- 👁️ **실시간 미리보기**: 인터랙티브 프리뷰 기능
- ⚡ **퍼포먼스 최적화**: Canvas API와 RequestAnimationFrame 활용

## 🎬 애니메이션 목록

### 1. **Particles Wave** 🌊
동적인 파티클 시스템으로 만들어지는 물결 패턴
- 파티클 간 연결선 애니메이션
- 마우스 인터랙션 가능
- 웨이브 모션 효과

### 2. **Gradient Mesh** 🎨
부드럽게 흐르는 그라디언트 오브로 만드는 메시 패턴
- CSS 그라디언트 애니메이션
- 멀티 레이어 블렌딩
- 플로팅 모션

### 3. **Geometric Grid** 🔷
애니메이션 기하학 패턴으로 만드는 동적 그리드
- 수학적 패턴 생성
- 로테이션 애니메이션
- 웨이브 변형

### 4. **Matrix Rain** 💚
매트릭스에서 영감을 받은 클래식 코드 레인 효과
- 랜덤 문자 생성
- 낙하 애니메이션
- 레트로 사이버 분위기

### 5. **Aurora Borealis** 🌌
하늘을 가로지르는 매혹적인 오로라 효과
- 사인 웨이브 기반 애니메이션
- 멀티 레이어 그라디언트
- 자연스러운 플로우

### 6. **Cosmic Dust** ⭐
우주 공간을 떠다니는 별과 우주 먼지
- 3D 원근 효과
- 스타필드 시뮬레이션
- 글로우 이펙트

### 7. **Liquid Morph** 💧
유기적인 애니메이션을 만드는 유체 모핑 형태
- 메타볼 알고리즘
- 플루이드 시뮬레이션
- 색상 블렌딩

### 8. **Neural Network** 🧠
AI 신경망을 시각화하는 연결된 노드
- 노드 간 연결 시각화
- 펄스 애니메이션
- 인터랙티브 네트워크

### 9. **Holographic Waves** 🌈
움직이는 미래지향적 홀로그래픽 웨이브 패턴
- 홀로그램 스타일링
- 멀티 레이어 웨이브
- 스캔라인 효과

### 10. **Cyber Grid** 🎮
사이버펑크 미학의 레트로 퓨처리스틱 3D 그리드
- 3D 원근 그리드
- 사이버펑크 컬러
- 데이터 패킷 애니메이션

## 📁 프로젝트 구조

```
hero-animations-gallery/
├── index.html              # 메인 갤러리 페이지
├── css/
│   └── style.css           # 스타일시트
├── js/
│   ├── main.js             # 메인 JavaScript
│   └── animations-data.js  # 애니메이션 데이터
├── animations/
│   ├── 01-particles-wave.html
│   ├── 02-gradient-mesh.html
│   ├── 03-geometric-grid.html
│   ├── 04-matrix-rain.html
│   ├── 05-aurora-borealis.html
│   ├── 06-cosmic-dust.html
│   ├── 07-liquid-morph.html
│   ├── 08-neural-network.html
│   ├── 09-holographic-waves.html
│   └── 10-cyber-grid.html
└── README.md
```

## 🚀 사용 방법

### 1. 갤러리로 사용
프로젝트를 다운로드하고 `index.html`을 브라우저에서 열면 모든 애니메이션을 미리보기할 수 있습니다.

### 2. 개별 애니메이션 사용
각 애니메이션 파일(`animations/` 폴더)은 독립적으로 동작합니다.
원하는 애니메이션 파일을 복사하여 프로젝트에 바로 사용할 수 있습니다.

```html
<!-- 예시: Particles Wave 사용 -->
<iframe src="animations/01-particles-wave.html"></iframe>
```

### 3. 코드 커스터마이징
각 애니메이션 파일 내에서 다음 요소들을 수정할 수 있습니다:
- 색상: CSS 변수 또는 Canvas 컬러 코드 수정
- 속도: JavaScript의 time 증가값 조정
- 크기/밀도: 파티클 개수, 그리드 사이즈 등 조정

## 💡 주요 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 
  - CSS Variables (테마 시스템)
  - Flexbox & Grid Layout
  - Transitions & Animations
  - Backdrop Filter
- **JavaScript (ES6+)**:
  - Canvas API
  - RequestAnimationFrame
  - Intersection Observer
  - LocalStorage (테마 저장)
- **Font Awesome**: 아이콘
- **Google Fonts**: Inter 폰트

## 🎨 테마 시스템

다크/라이트 모드는 CSS Variables를 활용하여 구현되었습니다:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #1a1a1a;
    --accent: #667eea;
}

[data-theme="dark"] {
    --bg-primary: #0f0f0f;
    --text-primary: #ffffff;
    --accent: #00d4ff;
}
```

테마는 LocalStorage에 저장되어 재방문 시 유지됩니다.

## ⌨️ 키보드 단축키

갤러리 페이지에서 사용 가능한 단축키:

- `ESC`: 모달 닫기
- `Ctrl/Cmd + C`: 코드 복사 (모달 열린 상태)
- `Ctrl/Cmd + F`: 전체화면으로 보기 (모달 열린 상태)

## 📱 반응형 브레이크포인트

- **Mobile**: 0px - 480px
- **Tablet**: 481px - 768px
- **Desktop**: 769px+

## 🌐 브라우저 지원

- ✅ Chrome/Edge (최신 2개 버전)
- ✅ Firefox (최신 2개 버전)
- ✅ Safari (최신 2개 버전)
- ✅ iOS Safari (최신 2개 버전)
- ✅ Chrome for Android (최신 2개 버전)

## 📊 성능 최적화

- Canvas 애니메이션은 `requestAnimationFrame` 사용
- Intersection Observer로 스크롤 애니메이션 최적화
- 이미지 대신 Canvas/CSS를 활용하여 로딩 시간 단축
- Lazy loading으로 초기 로딩 최적화

## 🔧 커스터마이징 가이드

### 색상 변경
각 애니메이션 파일에서 색상 관련 변수를 찾아 수정:

```javascript
// 라이트 모드 색상
ctx.fillStyle = 'rgba(102, 126, 234, 0.8)';

// 다크 모드 색상
ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
```

### 애니메이션 속도 조절
시간 증가값을 수정:

```javascript
time += 16; // 기본값 (60fps 기준)
time += 32; // 2배 빠르게
time += 8;  // 2배 느리게
```

### 파티클/요소 개수 조절
```javascript
const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
// 나누는 값을 줄이면 더 많은 파티클 생성
```

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

## 👨‍💻 제작자

**jvisualschool**
- Website: [jvisualschool.com](https://www.jvisualschool.com/)
- GitHub: [github.com/jvisualschool](https://github.com/jvisualschool)
- Instagram: [@jvisualschool](https://www.instagram.com/jvisualschool/)
- Email: jvisualschool@gmail.com

## 🤝 기여하기

이슈나 Pull Request는 언제든 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📮 피드백

프로젝트에 대한 피드백이나 제안사항이 있으시면 이슈를 등록해주세요!

## 🎯 향후 계획

- [ ] 추가 애니메이션 10개 더 제작
- [ ] 애니메이션 파라미터 실시간 조정 UI
- [ ] 애니메이션 조합 기능
- [ ] React/Vue/Svelte 컴포넌트 버전 제공
- [ ] NPM 패키지 배포
- [ ] 애니메이션 빌더 도구 개발

## 🌟 Star History

이 프로젝트가 유용하다면 ⭐️ Star를 눌러주세요!

---

Made with ❤️ by jvisualschool | 2025