import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

const BENEFITS = [
  {
    bg: '#EAF3FF', // 연한 파란색
    accent: '#3182F6',
    icon: '👁️',
    badge: 'VS 홍채·지문',
    title: '홍채, 지문보다\n정확합니다',
    stat: '1/100만',
    statLabel: '오인식률',
    desc: '홍채 인식보다 2배, 지문 인식보다 20배 정밀합니다.\n얼굴의 3만개 이상의 포인트를 실시간으로 분석해 본인만 인증합니다.',
  },
  {
    bg: '#FFF8EB', // 연한 노란색
    accent: '#F59E0B',
    icon: '🪙',
    badge: '포인트 혜택',
    title: '결제할 때마다\n포인트가 쌓입니다',
    stat: '최대 5%',
    statLabel: '자동 적립',
    desc: '얼굴결제 전용 혜택! 매 결제 시 최대 5% 토스포인트가 적립됩니다.\n카드 꺼낼 필요 없이, 쳐다보기만 해도 포인트가 쏟아집니다.',
  },
  {
    bg: '#EBF9F1', // 연한 초록색
    accent: '#22C55E',
    icon: '⚡',
    badge: '압도적 속도',
    title: '그 어떤 결제보다\n빠른 0.1초',
    stat: '0.1초',
    statLabel: '결제 완료',
    desc: '앱을 켜고, 비밀번호를 누르고, 바코드를 보여주는 과정이 사라집니다.\n단말기를 바라보는 순간, 결제가 끝납니다.',
  },
];

export default function BenefitSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 가로 스크롤 계산 (ReviewMarqueeSection 방식 차용)
  const scrollPercent = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const transform = useMotionTemplate`translateX(calc(-${scrollPercent}% + ${scrollPercent}vw))`;

  return (
    <section 
      ref={containerRef} 
      style={{ 
        height: '400vh', 
        position: 'relative', 
        width: '100%',
        display: 'block' 
      }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        display: 'flex', alignItems: 'center',
        overflow: 'hidden', background: '#FAFAFA'
      }}>
        
        {/* 가로 스크롤 트랙 */}
        <motion.div 
          style={{ 
            transform, 
            display: 'flex', 
            alignItems: 'center', 
            height: '100%', 
            width: 'max-content',
            flexShrink: 0
          }}
        >
          {/* 타이틀 (첫 화면) */}
          <div style={{
            paddingLeft: '15vw',
            paddingRight: '6rem', 
            flexShrink: 0,
            display: 'flex', flexDirection: 'column', justifyContent: 'center'
          }}>
            <div style={{ display: 'inline-block', background: '#EEF0F3', color: '#4E5968', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem', width: 'fit-content' }}>
              ✨ 왜 얼굴결제인가요?
            </div>
            <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, color: '#191F28', letterSpacing: '-2px', margin: 0 }}>
              이래서 <span style={{ color: '#3182F6' }}>얼굴결제</span><br />입니다
            </h1>
          </div>

          {/* 혜택 아이템들 */}
          <div style={{ display: 'flex', gap: '4rem', paddingRight: '15vw' }}>
            {BENEFITS.map((b, idx) => (
              <div 
                key={idx}
                style={{
                  width: '80vw',
                  maxWidth: '1000px',
                  height: '70vh',
                  background: b.bg,
                  borderRadius: '32px',
                  padding: '4rem',
                  display: 'flex',
                  gap: '4rem',
                  alignItems: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.04)'
                }}
              >
                {/* 배경 장식 원 */}
                <div style={{
                  position: 'absolute', top: '-10%', right: '-10%',
                  width: '50%', height: '80%', borderRadius: '50%',
                  background: `radial-gradient(circle, ${b.accent}15 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

                {/* 텍스트 영역 */}
                <div style={{ flex: 1, zIndex: 1 }}>
                  <div style={{ display: 'inline-block', background: b.accent, color: '#fff', padding: '0.5rem 1.2rem', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem' }}>
                    {b.badge}
                  </div>
                  <h2 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, color: '#191F28', lineHeight: 1.25, letterSpacing: '-2px', margin: '0 0 1.5rem 0', whiteSpace: 'pre-line' }}>
                    {b.title}
                  </h2>
                  <p style={{ color: '#4E5968', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                    {b.desc}
                  </p>
                </div>

                {/* 우측 강조 스탯 */}
                <div style={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                  <div style={{ fontSize: '8rem', lineHeight: 1, marginBottom: '1rem', filter: `drop-shadow(0 20px 30px ${b.accent}40)` }}>
                    {b.icon}
                  </div>
                  <div style={{ fontSize: 'clamp(3rem, 4vw, 4rem)', fontWeight: 900, color: b.accent, letterSpacing: '-2px', lineHeight: 1 }}>
                    {b.stat}
                  </div>
                  <div style={{ fontSize: '1.4rem', color: '#6B7684', fontWeight: 800, marginTop: '0.5rem' }}>
                    {b.statLabel}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  );
}
