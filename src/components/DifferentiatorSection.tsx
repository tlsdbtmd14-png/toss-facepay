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
  // v=1일 때: calc(-100% + 100vw)
  const xMove = useTransform(scrollYProgress, (v) => `calc(${v * -100}% + ${10 + (v * 90)}vw)`);

  return (
    <div 
      ref={containerRef}
      data-bgcolor="#E8F8EE"
      style={{ height: '400vh', position: 'relative', width: '100%', background: 'transparent', margin: '0' }}
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
            padding: '0',
            width: 'max-content'
          }}
        >
          <div style={{ display: 'flex', gap: '30vw', alignItems: 'center', width: 'max-content', paddingRight: '5vw' }}>
            
            {/* 타이틀 1 */}
            <div style={{ fontSize: 'clamp(5rem, 12vw, 10rem)', fontWeight: 900, color: '#111', letterSpacing: '-4px', flexShrink: 0 }}>
              이래서 <span style={{ color: '#3182F6' }}>얼굴결제</span>입니다
            </div>

            {/* 포인트 1: 정확도 (Image 1 스타일 - 69.4세 레퍼런스) */}
            <div style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0, position: 'relative' }}>
              {/* 거대 숫자 영역 */}
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.75, fontWeight: 900, letterSpacing: '-0.05em', color: '#111' }}>
                <div style={{ fontSize: '28vw' }}>99</div>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '28vw' }}>.99</span>
                  <span style={{ fontSize: '10vw', fontWeight: 800, marginLeft: '-1vw' }}>%</span>
                </div>
              </div>
              {/* 우측 설명 텍스트 (위쪽에 딱 붙어서) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'normal', width: '550px', marginTop: '3vw', marginLeft: '2vw' }}>
                <p style={{ fontSize: '2.4rem', fontWeight: 800, color: '#111', wordBreak: 'keep-all', lineHeight: 1.4, margin: 0 }}>
                  토스가 자체 개발한<br/>얼굴인식 기술의 정확도입니다.
                </p>
                <p style={{ fontSize: '1.4rem', color: '#333', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  토스가 직접 만든 얼굴인식 기술은 99.99%의 정확도로 당신의 얼굴을 알아봅니다. 사진이나 영상이 아닌 진짜 얼굴만 인식하는 라이브니스(Liveness) 기술이 더해져, 오직 나의 얼굴로만 결제됩니다.
                </p>
              </div>
            </div>

            {/* 포인트 2: 속도 (Image 3 스타일 - 여전히 일을 하고 싶다 레퍼런스) */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, position: 'relative', marginTop: '5vw' }}>
              <div style={{ fontSize: '7vw', fontWeight: 800, color: '#111', marginRight: '1vw', alignSelf: 'flex-end', marginBottom: '5vw', letterSpacing: '-0.05em' }}>단</div>
              <div style={{ fontSize: '35vw', lineHeight: 0.75, fontWeight: 900, letterSpacing: '-0.05em', color: '#111' }}>1</div>
              <div style={{ fontSize: '7vw', fontWeight: 800, color: '#111', marginLeft: '1vw', alignSelf: 'flex-end', marginBottom: '5vw', letterSpacing: '-0.05em' }}>초</div>
              
              {/* 우측 상단 설명 텍스트 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'normal', width: '550px', alignSelf: 'flex-start', marginLeft: '4vw', paddingTop: '2vw' }}>
                <p style={{ fontSize: '2.4rem', fontWeight: 800, color: '#111', wordBreak: 'keep-all', lineHeight: 1.4, margin: 0 }}>
                  그 어떤 결제보다 빠른 속도.<br/>단말기를 쳐다보는 순간, 결제와 적립이 끝납니다.
                </p>
                <p style={{ fontSize: '1.4rem', color: '#333', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  지갑을 꺼내고, 카드를 꽂고, 서명하던 모든 과정을 단 1초로 줄였습니다. 토스 앱을 따로 열 필요도 없이, 단말기 앞에서 "페이스페이로 결제할게요"라고 말하면 끝납니다.
                </p>
              </div>
            </div>

            {/* 포인트 3: 휴대성 (Image 2 스타일 - 내 삶에 만족 레퍼런스) */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, position: 'relative', marginLeft: '10vw' }}>
              <div style={{ fontSize: '5.5vw', fontWeight: 800, color: '#111', marginBottom: '1vw', zIndex: 10, letterSpacing: '-0.05em' }}>이제 들고 다닐 건,</div>
              <div style={{ display: 'flex', alignItems: 'baseline', lineHeight: 0.85, fontWeight: 900, letterSpacing: '-0.05em', color: '#111' }}>
                <span style={{ fontSize: '35vw' }}>0</span>
                <span style={{ fontSize: '12vw', fontWeight: 800 }}>개</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', whiteSpace: 'normal', width: '700px', marginTop: '3vw', alignSelf: 'flex-start', paddingLeft: '5vw' }}>
                <p style={{ fontSize: '1.6rem', color: '#333', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  카드도, 휴대폰도 꺼낼 필요 없습니다. 페이스페이는 얼굴 자체가 결제 수단이니까요. 흔히 떠올리는 지문이나 홍채도 결국 폰을 꺼내 잠금을 풀어야 하지만, 페이스페이는 그마저도 필요 없습니다. 가진 게 얼굴뿐이어도, 결제는 끝납니다.
                </p>
              </div>
            </div>

            {/* 포인트 4: 이용률 */}
            <div style={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0, position: 'relative', marginLeft: '5vw' }}>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 0.75, fontWeight: 900, letterSpacing: '-0.05em', color: '#111' }}>
                <div style={{ display: 'flex', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '32vw' }}>60</span>
                  <span style={{ fontSize: '10vw', fontWeight: 800 }}>%</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', whiteSpace: 'normal', width: '550px', marginLeft: '3vw', marginBottom: '4vw' }}>
                <p style={{ fontSize: '2.4rem', fontWeight: 800, color: '#111', wordBreak: 'keep-all', lineHeight: 1.4, margin: 0 }}>
                  한 번 써본 사람 10명 중 6명이<br/>한 달 안에 다시 찾았습니다.
                </p>
                <p style={{ fontSize: '1.4rem', color: '#333', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                  출시 두 달 만에 가입자 40만 명을 넘어섰고, 한 달 내 재이용률은 약 60%에 이릅니다. 낯설 것 같던 첫인상과 달리, 한 번 경험한 사람들이 계속 얼굴로 결제하고 있습니다.
                </p>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
