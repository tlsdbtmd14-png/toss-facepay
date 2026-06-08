import HeroSection from './components/HeroSection';
import IntroTextSection from './components/IntroTextSection';
import PollSection from './components/PollSection';
import SituationSection from './components/SituationSection';
import FacePayExperience from './components/FacePayExperience';
import DifferentiatorSection from './components/DifferentiatorSection';
import ReviewMarqueeSection from './components/ReviewMarqueeSection';
import EndPlaceholderSection from './components/EndPlaceholderSection';
import ScrollIndicator from './components/ScrollIndicator';


function App() {
  return (
    <div className="app-container">
      <main className="content-container">
        <HeroSection />
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
