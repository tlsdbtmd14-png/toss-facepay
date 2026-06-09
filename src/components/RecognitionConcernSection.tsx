import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';

export default function RecognitionConcernSection({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 전체 스크롤 길이를 800vh로 늘림 (각 요소가 완전히 등장하고 다음 요소가 나오게끔 조절)
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Step 2 (now Step 1): 4분할 화면 (0.0 ~ 0.85 구간)
  const step2Opacity = useTransform(scrollYProgress, [0, 0.85, 0.9, 1], [1, 1, 0, 0]);
  const step2Scale = useTransform(scrollYProgress, [0, 0.85, 0.9, 1], [1, 1, 0.8, 0.8]);

  // 아이템0 등장 (0.05 ~ 0.15), 그리고 대기 (0.15 ~ 0.25)
  const item0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 1], [0, 0, 1, 1]);
  const item0Y = useTransform(scrollYProgress, [0, 0.05, 0.15, 1], [60, 60, 0, 0]);

  // 아이템1 등장 (0.25 ~ 0.35), 그리고 대기 (0.35 ~ 0.45)
  const item1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [0, 0, 1, 1]);
  const item1Y = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [60, 60, 0, 0]);

  // 아이템2 등장 (0.45 ~ 0.55), 그리고 대기 (0.55 ~ 0.65)
  const item2Opacity = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0, 0, 1, 1]);
  const item2Y = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [60, 60, 0, 0]);

  // 아이템3 등장 (0.65 ~ 0.75), 그리고 대기 (0.75 ~ 0.85)
  const item3Opacity = useTransform(scrollYProgress, [0, 0.65, 0.75, 1], [0, 0, 1, 1]);
  const item3Y = useTransform(scrollYProgress, [0, 0.65, 0.75, 1], [60, 60, 0, 0]);

  const itemOpacities = [item0Opacity, item1Opacity, item2Opacity, item3Opacity];
  const itemYs = [item0Y, item1Y, item2Y, item3Y];

  // Step 3 (now Step 2): 최종 5얼굴 통합 (0.9 ~ 1.0)
  const step3Opacity = useTransform(scrollYProgress, [0, 0.9, 0.95, 1], [0, 0, 1, 1]);
  const step3Scale = useTransform(scrollYProgress, [0, 0.9, 0.95, 1], [1.2, 1.2, 1, 1]);

  const images = [
    '/uploaded_face_1.png', 
    '/uploaded_face_2.png', // 모자
    '/uploaded_face_3.png', // 안경
    '/uploaded_face_4.png', // 화장 유무
    '/uploaded_face_5.png', // 쌍둥이
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* 1부: 다양한 모습 인식 (600vh) */}
      <div 
        ref={containerRef} 
        style={{ height: '600vh', position: 'relative', width: '100%' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', zIndex: 10 }}>
        
        {/* Step 2: 4분할 화면 */}
        <motion.div style={{ position: 'absolute', opacity: step2Opacity, scale: step2Scale, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          
          {/* 삭제된 첫 화면의 타이틀을 여기로 옮겨서 문맥을 유지합니다. */}
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: '#191F28', marginBottom: '1rem', letterSpacing: '-1px' }}>
            내 얼굴, 매일 똑같지 않은데 인식이 잘 될까요?
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 6rem' }}>
            {[
              { img: images[1], text: '모자를 푹 눌러써도' },
              { img: images[3], text: '안경을 바꿔써도' },
              { img: images[4], text: '화장을 해도' },
              { img: images[2], text: '심지어 쌍둥이여도' }
            ].map((item, i) => (
              <motion.div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: itemOpacities[i], y: itemYs[i] }}>
                <img 
                  src={item.img} 
                  alt={item.text} 
                  style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '48px', boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }} 
                />
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#333D4B' }}>{item.text}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 3 (now Step 2): 최종 5얼굴 통합 */}
        <motion.div style={{ position: 'absolute', opacity: step3Opacity, scale: step3Scale, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4rem', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', padding: '0 2rem' }}>
            {images.map((img, i) => (
              <img 
                key={i} 
                src={img} 
                alt={`Face variant ${i}`} 
                style={{ 
                  width: '160px', 
                  height: '160px', 
                  objectFit: 'cover', 
                  borderRadius: '50%', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.06)', 
                  border: '4px solid #FFFFFF' 
                }} 
              />
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: 'rgba(49, 130, 246, 0.1)', color: '#3182F6', borderRadius: '8px', fontSize: '1.3rem', fontWeight: 700 }}>
              페이셜 레코그니션(Facial Recognition) 모델
            </span>
            <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, color: '#191F28', textAlign: 'center', letterSpacing: '-1.5px', lineHeight: 1.3, margin: 0 }}>
              토스는 당신의 <span style={{ color: '#3182F6' }}>모든 모습</span>을<br/>정확히 인식합니다.
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#6B7684', textAlign: 'center', lineHeight: 1.6, wordBreak: 'keep-all', maxWidth: '650px', fontWeight: 500, margin: 0 }}>
              얼굴의 기하학적 굴곡을 정밀하게 계산하여, 매일 바뀌는 화장이나 헤어스타일은 물론 쌍둥이와 같은 가족 간의 미묘한 차이까지 완벽하게 판별해 냅니다.
            </p>
          </div>
        </motion.div>

      </div>
      </div>

      {/* 2부: 라이브니스 기술 시각화 (300vh) */}
      <LivenessVisualizer scrollContainerRef={scrollContainerRef} />
      
    </div>
  );
}

// ── 라이브니스(Liveness) 기술 시각화 컴포넌트 ──────────────────────────────────────────────
function LivenessVisualizer({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    container: scrollContainerRef,
    offset: ['start start', 'end end']
  });

  const [phase, setPhase] = useState(0);

  // 스크롤 연동 대신, 일정 시간(4초)마다 자동으로 페이즈를 전환하여 무한 루프 시킵니다.
  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((prev) => (prev + 1) % 3);
    }, 4500); // 4.5초마다 다음 단계로 넘어감
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', overflow: 'hidden' }}>

        
        <div style={{ display: 'flex', width: '100%', maxWidth: '1000px', padding: '0 2rem', gap: '4rem', alignItems: 'center' }}>
          
          {/* 좌측: 유저 (새로 업로드된 이미지로 깜빡임 구현) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              position: 'relative', 
              width: '400px', 
              height: '400px', 
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.12))'
            }}>
              {/* 뜬 눈 이미지 */}
              <motion.img 
                src="/동그란 눈 이미지.png"
                alt="Face Open Eyes"
                animate={{ opacity: [1, 1, 0, 1, 1] }} 
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              />
              {/* 감은 눈 이미지 */}
              <motion.img 
                src="/눈 감은 얼굴 이미지.png"
                alt="Face Closed Eyes"
                animate={{ opacity: [0, 0, 1, 0, 0] }} 
                transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* 우측: 텍스트 설명 영역 */}
          <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '2rem' }}>
            
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ display: 'inline-block', padding: '0.6rem 1.2rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', borderRadius: '8px', fontSize: '1.3rem', fontWeight: 700 }}>
                라이브니스(Liveness) 생체 판별 기술
              </span>
            </div>

            {/* 텍스트 영역 */}
            <div style={{ height: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <AnimatePresence mode="wait">
                {phase === 0 && (
                  <motion.div key="text0" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                    <h3 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#191F28', margin: 0, letterSpacing: '-0.5px' }}>지금 이 순간,</h3>
                    <p style={{ fontSize: '1.6rem', color: '#4E5968', fontWeight: 600, marginTop: '1.2rem', lineHeight: 1.5 }}>
                      단말기가 미세한 움직임을 분석해<br/>살아있는 당신을 감지합니다.
                    </p>
                  </motion.div>
                )}
                {phase === 1 && (
                  <motion.div key="text1" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '2rem' }}>🚫</span>
                      <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#EF4444', margin: 0, letterSpacing: '-0.5px' }}>가짜 얼굴 (2D 사진) 차단</h3>
                    </div>
                    <p style={{ fontSize: '1.4rem', color: '#4E5968', fontWeight: 600, lineHeight: 1.6, wordBreak: 'keep-all' }}>
                      사진이나 영상으로는 절대 결제할 수 없어요.<br/>2D 이미지는 모공과 피부 요철을 재현하지 못하거든요.
                    </p>
                  </motion.div>
                )}
                {phase === 2 && (
                  <motion.div key="text2" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                      <span style={{ fontSize: '2rem' }}>✅</span>
                      <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22C55E', margin: 0, letterSpacing: '-0.5px' }}>진짜 얼굴 (생체 신호) 승인</h3>
                    </div>
                    <p style={{ fontSize: '1.4rem', color: '#4E5968', fontWeight: 600, lineHeight: 1.6, wordBreak: 'keep-all' }}>
                      진짜 사람의 혈류로 인한 피부 색상의 미묘한 변화는<br/>당신이 살아있다는 가장 확실한 징후예요.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
  );
}
