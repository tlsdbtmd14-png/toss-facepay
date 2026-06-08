import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 1번 이미지 재현: 흰 배경 자리 — 부드러운 화이트 + 은은한 스카이블루 메시
const BG_LIGHT =
  'radial-gradient(ellipse 60% 55% at 18% 28%, rgba(110,170,255,0.55) 0%, rgba(110,170,255,0) 60%),' +
  'radial-gradient(ellipse 70% 55% at 40% 96%, rgba(70,140,255,0.5) 0%, rgba(70,140,255,0) 58%),' +
  'radial-gradient(ellipse 55% 50% at 78% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%),' +
  'linear-gradient(125deg, #dcebff 0%, #f4f9ff 50%, #eaf3ff 100%)';

// 2번 이미지 재현: 파란 배경 자리 — 무지개 메시 그라데이션
const BG_RAINBOW =
  'radial-gradient(circle at 12% 18%, #6f8cff 0%, rgba(111,140,255,0) 36%),' +
  'radial-gradient(circle at 6% 82%, #ff5fd0 0%, rgba(255,95,208,0) 40%),' +
  'radial-gradient(circle at 86% 18%, #ff7a8b 0%, rgba(255,122,139,0) 42%),' +
  'radial-gradient(circle at 55% 92%, #ffb35f 0%, rgba(255,179,95,0) 42%),' +
  'radial-gradient(circle at 90% 82%, #7fe8a6 0%, rgba(127,232,166,0) 40%),' +
  'linear-gradient(120deg, #b6a0ff 0%, #ffd2a6 100%)';

export default function DynamicBackground() {
  // 0 = light(흰배경 자리), 1 = rainbow(파란배경 자리)
  const [variant, setVariant] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sections = Array.from(document.querySelectorAll('section'));
            const index = sections.indexOf(entry.target);

            if (index !== -1) {
              // 전체 섹션 라이트 배경으로 통일
              setVariant(0);
            }
          }
        });
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const layerBase: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: -1,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <>
      {/* 레이어 A: 라이트(흰 배경 자리) */}
      <motion.div
        style={{ ...layerBase, background: BG_LIGHT }}
        animate={{ opacity: variant === 0 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
      {/* 레이어 B: 무지개(파란 배경 자리) */}
      <motion.div
        style={{ ...layerBase, background: BG_RAINBOW }}
        animate={{ opacity: variant === 1 ? 1 : 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      />
    </>
  );
}
