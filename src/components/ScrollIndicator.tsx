import { useState, useEffect } from 'react';

export default function ScrollIndicator({ totalSections = 10 }: { totalSections?: number }) {
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    let observer: IntersectionObserver;
    const initObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sections = Array.from(document.querySelectorAll('main.content-container > section'));
              const index = sections.indexOf(entry.target as HTMLElement);
              if (index !== -1) {
                setActiveSection(index);
              }
            }
          });
        },
        {
          root: null,
          rootMargin: '-10% 0px',
          threshold: 0.3,
        }
      );

      const sections = document.querySelectorAll('main.content-container > section');
      sections.forEach((section) => observer.observe(section));
      setActualTotal(sections.length);
    };

    // DOM 완전 렌더링 후 실행을 보장하기 위한 약간의 지연
    const timer = setTimeout(initObserver, 100);

    // 강력한 폴백: 스크롤이 맨 위로 올라갔을 때 무조건 0번 섹션 활성화
    const handleScrollFallback = () => {
      if (window.scrollY <= 50) {
        setActiveSection(0);
      }
    };
    window.addEventListener('scroll', handleScrollFallback);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollFallback);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  // 실제 총 섹션 수 관리
  const [actualTotal, setActualTotal] = useState(totalSections);

  return (
    <div className="scroll-indicator-container">
      {Array.from({ length: actualTotal }).map((_, index) => (
        <div
          key={index}
          className={`scroll-dot ${index === activeSection ? 'active' : ''}`}
          onClick={() => {
            const sections = Array.from(document.querySelectorAll('main.content-container > section')) as HTMLElement[];
            if (sections[index]) {
              if (index === 0) {
                // 첫 번째 섹션(HeroSection)은 무조건 페이지 맨 위로 이동
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              } else {
                // 다른 섹션들은 절대 좌표를 계산하여 스크롤
                const top = sections[index].getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top, behavior: 'smooth' });
              }
            }
          }}
        />
      ))}
    </div>
  );
}
