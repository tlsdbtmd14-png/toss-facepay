import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import ExperimentalHeroSection from './components/ExperimentalHeroSection';
import IntroTextSection from './components/IntroTextSection';
import PollSection from './components/PollSection';
import SituationSection from './components/SituationSection';
import FacePayExperience from './components/FacePayExperience';
import DifferentiatorSection from './components/DifferentiatorSection';
import ReviewMarqueeSection from './components/ReviewMarqueeSection';
import EndPlaceholderSection from './components/EndPlaceholderSection';
import ScrollIndicator from './components/ScrollIndicator';


const EXPERIMENTAL_MODE = false; // 언제든 false로 바꾸면 원래 디자인으로 복구됩니다!

function App() {
  const [bgColor, setBgColor] = useState('#FFFFFF');

  useEffect(() => {
    // Scroll Spy: 화면 정중앙에 어떤 섹션이 있는지 관찰
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const color = entry.target.getAttribute('data-bgcolor');
          if (color) {
            setBgColor(color);
          }
        }
      });
    }, {
      rootMargin: "-50% 0px -50% 0px" // 정확히 화면 정중앙(50%)을 지나는 요소를 타겟으로 함
    });

    const sections = document.querySelectorAll('[data-bgcolor]');
    sections.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="app-container">
      {/* 전역 배경 레이어 (부드러운 크로스페이드) */}
      <div 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, 
          backgroundColor: bgColor, transition: 'background-color 0.8s ease' 
        }} 
      />
      <main className="content-container">
        {EXPERIMENTAL_MODE ? <ExperimentalHeroSection /> : <HeroSection />}
        <IntroTextSection />

        {/* 걱정 투표 + 보안 페이지 통합 섹션 */}
        <PollSection />
        <FacePayExperience />
        <DifferentiatorSection />
        <ReviewMarqueeSection />

        {/* '오늘 점심' 스토리 */}
        <SituationSection />

        {/* 결론 섹션 (맨 마지막) */}
        <EndPlaceholderSection />
      </main>


      <ScrollIndicator totalSections={9} />
    </div>
  );
}

export default App;
