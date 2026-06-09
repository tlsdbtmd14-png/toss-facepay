import { motion, useScroll, useTransform } from 'framer-motion';

export default function ExperimentalHeroSection() {
  const { scrollY } = useScroll();

  // 스크롤 내릴 때 부드럽게 축소 + 페이드아웃
  const scale = useTransform(scrollY, [0, 500], [1, 0.5]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="hero-section" data-bgcolor="#87CEEB" style={{ position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <motion.div
        className="hero-logo-container"
        style={{ scale, opacity, y, width: '100%', height: '100%' }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          {/* 텍스트: 좌측 상단 절대 배치 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ 
              position: 'absolute',
              top: '12vh',
              left: '3vw',
              zIndex: 10,
            }}
          >
            <h1
              style={{
                color: '#191F28',
                fontWeight: 800,
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                lineHeight: 1.25,
                letterSpacing: '-2px',
                margin: 0,
              }}
            >
              결제의 새 얼굴<br />
              <span style={{ color: '#3182F6' }}>토스 페이스페이</span>
            </h1>
          </motion.div>

          {/* 중앙 거대 이미지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ 
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              paddingTop: '8vh', // 텍스트와 약간의 균형을 위해 살짝 내림
            }}
          >
            <img
              src="/실험디자인.png"
              alt="실험 디자인 이미지"
              style={{
                width: '90%',
                maxWidth: '1400px', // 훨씬 더 크게!
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 40px 60px rgba(49,130,246,0.25))',
                objectFit: 'contain',
                maxHeight: '85vh', // 너무 커서 화면을 뚫고 나가지 않도록
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
