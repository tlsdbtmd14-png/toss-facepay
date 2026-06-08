import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function DifferentiatorSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 스크롤 길이를 400vh로 확보
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // 스크롤에 따라 X축(가로) 이동
  // 스크롤에 따라 X축(가로) 이동
  // Framer Motion에서 calc() 문자열 포맷이 다르면 보간(Interpolation)이 안 되어 건너뛰는 버그가 있습니다.
  // 따라서 진행률(v)에 따라 정확한 calc() 문자열을 동적으로 생성하도록 수정합니다.
  // v=0일 때: calc(0% + 10vw)
  // v=1일 때: calc(-100% + 75vw)
  const xMove = useTransform(scrollYProgress, (v) => `calc(${v * -100}% + ${10 + (v * 65)}vw)`);

  return (
    <div 
      ref={containerRef}
      style={{ height: '400vh', position: 'relative', width: '100%', background: '#E8EBED', margin: '20vh 0' }}
    >
      <div style={{
        position: 'sticky', 
        top: 0, 
        height: '100vh', 
        width: '100%',
        display: 'flex', 
        alignItems: 'center',
        overflow: 'hidden'
      }}>
        
        <motion.div 
          style={{ 
            x: xMove, 
            display: 'flex', 
            alignItems: 'center',
            whiteSpace: 'nowrap',
            padding: '0', // 패딩 제거, xMove 값으로만 위치 제어
            width: 'max-content'
          }}
        >
          <div style={{ display: 'flex', gap: '25vw', alignItems: 'center', width: 'max-content' }}>
            
            {/* 타이틀 1 */}
            <div style={{ fontSize: 'clamp(5rem, 12vw, 10rem)', fontWeight: 900, color: '#191F28', letterSpacing: '-4px', flexShrink: 0 }}>
              이래서 <span style={{ color: '#3182F6' }}>얼굴결제</span>입니다
            </div>

            {/* 포인트 2: 정확도 (거대 숫자 스태킹 레이아웃) */}
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexShrink: 0 }}>
              {/* 거대 숫자 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.85, fontWeight: 900, letterSpacing: '-0.05em', color: '#191F28' }}>
                <div style={{ fontSize: '20vw' }}>1</div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '18vw' }}>/100</span>
                  <span style={{ fontSize: '7vw', fontWeight: 800, marginLeft: '0.5rem' }}>만</span>
                </div>
              </div>
              {/* 우측 설명 텍스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'normal', width: '400px', marginTop: '10vw' }}>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#191F28', wordBreak: 'keep-all', lineHeight: 1.5, margin: 0 }}>
                  홍채, 지문보다 정확한 오인식률.<br/>
                  현재 금융권 최고 수준의 보안을<br/>
                  자랑합니다.
                </p>
                <p style={{ fontSize: '1.2rem', color: '#4E5968', lineHeight: 1.6, margin: 0 }}>
                  결제 시 100만 번 중 단 1번의 오차만 허용하는<br/>
                  완벽에 가까운 기술력으로 당신의 자산을 지킵니다.
                </p>
              </div>
            </div>

            {/* 포인트 3: 포인트 적립 (거대 숫자 3단 레이아웃) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 0.9, color: '#191F28' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#4E5968', marginBottom: '1rem' }}>(최대)</span>
                </div>
                <span style={{ fontSize: '18vw', fontWeight: 900, letterSpacing: '-0.05em' }}>5</span>
                <span style={{ fontSize: '7vw', fontWeight: 800, marginLeft: '1rem' }}>%</span>
              </div>
              <p style={{ fontSize: '2.2rem', fontWeight: 700, color: '#191F28', whiteSpace: 'normal', width: '600px', lineHeight: 1.5, margin: 0 }}>
                결제할 때마다 조건 없이 자동으로 쌓이는<br/>
                놀라운 포인트 혜택을 경험하세요.<br/>
                매일매일 결제하는 즐거움을 느껴보세요.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 0.9, color: '#191F28' }}>
                <span style={{ fontSize: '14vw', fontWeight: 900, letterSpacing: '-0.05em' }}>무제한</span>
                <span style={{ fontSize: '6vw', fontWeight: 800, marginLeft: '1rem' }}>적립</span>
              </div>
            </div>

            {/* 포인트 4: 결제 속도 (거대 숫자 스태킹 레이아웃) */}
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexShrink: 0 }}>
              {/* 거대 숫자 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.85, fontWeight: 900, letterSpacing: '-0.05em', color: '#191F28' }}>
                <div style={{ fontSize: '20vw' }}>0</div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '18vw' }}>.1</span>
                  <span style={{ fontSize: '7vw', fontWeight: 800, marginLeft: '0.5rem' }}>초</span>
                </div>
              </div>
              {/* 우측 설명 텍스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'normal', width: '400px', marginTop: '10vw' }}>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: '#191F28', wordBreak: 'keep-all', lineHeight: 1.5, margin: 0 }}>
                  그 어떤 결제보다 빠른 속도.<br/>
                  단말기를 쳐다보는 순간 이미<br/>
                  결제는 완료되어 있습니다.
                </p>
                <p style={{ fontSize: '1.2rem', color: '#4E5968', lineHeight: 1.6, margin: 0 }}>
                  지갑을 꺼내고, 카드를 꽂고, 서명하는<br/>
                  모든 번거로운 과정을 단 0.1초로 단축했습니다.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
