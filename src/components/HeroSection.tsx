import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroSection() {
  const { scrollY } = useScroll();

  // 스크롤 내릴 때 부드럽게 축소 + 페이드아웃
  const scale = useTransform(scrollY, [0, 500], [1, 0.5]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  return (
    <section className="hero-section" data-bgcolor="#FFFFFF">
      <motion.div
        className="hero-logo-container"
        style={{ scale, opacity, y }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 5vw',
            flexWrap: 'wrap',
            position: 'relative'
          }}
        >
          {/* 플로팅 장식 1: 좌측 상단 (왼쪽 보는 마크) */}
          <motion.img
            src="/왼쪽 보는 마크.png"
            alt="장식 요소 좌상단"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '-35%',
              left: '0%',
              width: '180px',
              zIndex: 0
            }}
          />
          
          {/* 플로팅 장식 2: 좌측 하단 (오른쪽 보는 마크) */}
          <motion.img
            src="/오른쪽 보는 마크.png"
            alt="장식 요소 좌하단"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut', delay: 0.5 }}
            style={{
              position: 'absolute',
              bottom: '-35%',
              left: '5%',
              width: '180px',
              zIndex: 0
            }}
          />

          {/* 플로팅 장식 3: 중앙 상단 (정면 보는 마크) */}
          <motion.img
            src="/정면 보는 마크.png"
            alt="장식 요소 중앙상단"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
            style={{
              position: 'absolute',
              top: '-45%',
              left: '45%',
              width: '150px',
              zIndex: 0
            }}
          />

          {/* 플로팅 장식 4: 중앙 메인 (정면 보는 마크, 엄청 크게) */}
          <motion.img
            src="/정면 보는 마크.png"
            alt="장식 요소 메인"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '5%',
              left: '38%',
              width: '380px',
              zIndex: 5,
              filter: 'drop-shadow(0 20px 40px rgba(49,130,246,0.25))'
            }}
          />

          {/* 왼쪽: 텍스트 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            style={{ flex: '1 1 320px', minWidth: 0, zIndex: 10 }}
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
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#6B7684', 
              marginTop: '1.5rem', 
              lineHeight: 1.6, 
              fontWeight: 500,
              wordBreak: 'keep-all'
            }}>
              얼굴만으로 쉽고 안전하게,<br />
              새로운 결제 경험을 만나보세요
            </p>
          </motion.div>

          {/* 오른쪽: 단말기 이미지 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{ flex: '0 1 380px', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 10 }}
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
                position: 'relative',
                zIndex: 2
              }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
