import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();

  // 스크롤 내릴 때 부드럽게 축소 + 페이드아웃
  const scale = useTransform(scrollY, [0, 500], [1, 0.5]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="hero-section">
      <motion.div
        className="hero-logo-container"
        style={{ scale, opacity, y }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(1rem, 4vw, 4rem)',
            width: '100%',
            maxWidth: '1080px',
            padding: '0 5vw',
            flexWrap: 'wrap',
          }}
        >
          {/* 왼쪽: 텍스트 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ flex: '1 1 320px', minWidth: 0 }}
          >
            <h1
              style={{
                color: '#191F28',
                fontWeight: 800,
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                lineHeight: 1.28,
                letterSpacing: '-2px',
                margin: 0,
              }}
            >
              결제의 새 얼굴<br />
              <span style={{ color: '#3182F6' }}>토스 페이스페이</span>
            </h1>
          </motion.div>

          {/* 오른쪽: 단말기 이미지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ flex: '0 1 380px', display: 'flex', justifyContent: 'center' }}
          >
            <img
              src="/hero-terminal.png"
              alt="토스 페이스페이 결제 단말기"
              style={{
                width: '100%',
                maxWidth: '360px',
                height: 'auto',
                display: 'block',
                filter: 'drop-shadow(0 30px 50px rgba(49,130,246,0.18))',
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
