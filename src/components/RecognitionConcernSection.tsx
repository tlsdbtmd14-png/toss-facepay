import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function RecognitionConcernSection({ scrollContainerRef }: { scrollContainerRef?: React.RefObject<HTMLElement> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 전체 스크롤 길이는 300vh로 설정하여 각 스텝별로 100vh 정도 할당
  const { scrollYProgress } = useScroll({
    container: scrollContainerRef,
    // fallback target in case container isn't passed properly
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // 애니메이션 스텝 (0 ~ 1) 전체 구간을 명시하여 보간(Extrapolation) 오류를 완벽히 차단합니다.
  // Step 1: 0.0 ~ 0.25 (유지), 0.25 ~ 0.35 (페이드아웃)
  const step1Opacity = useTransform(scrollYProgress, [0, 0.25, 0.35, 1], [1, 1, 0, 0]);
  const step1Scale = useTransform(scrollYProgress, [0, 0.35, 1], [1, 0.8, 0.8]);

  // Step 2: 0.3 ~ 0.4 (페이드인), 0.4 ~ 0.6 (유지), 0.6 ~ 0.7 (페이드아웃)
  const step2Opacity = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7, 1], [0, 0, 1, 1, 0, 0]);
  const step2Scale = useTransform(scrollYProgress, [0, 0.3, 0.4, 0.6, 0.7, 1], [1.2, 1.2, 1, 1, 0.8, 0.8]);

  // Step 3: 0.65 ~ 0.75 (페이드인), 0.75 ~ 1.0 (유지)
  const step3Opacity = useTransform(scrollYProgress, [0, 0.65, 0.75, 1], [0, 0, 1, 1]);
  const step3Scale = useTransform(scrollYProgress, [0, 0.65, 0.75, 1], [1.2, 1.2, 1, 1]);

  // 사용자가 직접 업로드한 5장의 이미지를 사용합니다.
  const images = [
    '/uploaded_face_1.png', // 기본
    '/uploaded_face_2.png', // 모자
    '/uploaded_face_3.png', // 안경
    '/uploaded_face_4.png', // 화장 유무
    '/uploaded_face_5.png', // 쌍둥이
  ];

  return (
    <div 
      ref={containerRef} 
      style={{ height: '300vh', position: 'relative', width: '100%' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', zIndex: 10 }}>
        
        {/* Step 1: 기본 얼굴 */}
        <motion.div style={{ position: 'absolute', opacity: step1Opacity, scale: step1Scale, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <img 
            src={images[0]} 
            alt="Base Face" 
            style={{ width: '320px', height: '320px', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }} 
          />
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#191F28', marginBottom: '1rem', letterSpacing: '-1px' }}>
              내 얼굴, 매일 똑같지 않은데
            </h2>
            <p style={{ fontSize: '1.8rem', color: '#6B7684', fontWeight: 500 }}>인식이 잘 될까요?</p>
          </div>
        </motion.div>

        {/* Step 2: 4분할 화면 */}
        <motion.div style={{ position: 'absolute', opacity: step2Opacity, scale: step2Scale, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem 8rem' }}>
          {[
            { img: images[1], text: '모자를 푹 눌러써도' },
            { img: images[3], text: '안경을 바꿔써도' },
            { img: images[4], text: '화장을 해도' },
            { img: images[2], text: '심지어 쌍둥이여도' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <img 
                src={item.img} 
                alt={item.text} 
                style={{ width: '240px', height: '240px', objectFit: 'cover', borderRadius: '48px', boxShadow: '0 15px 30px rgba(0,0,0,0.08)' }} 
              />
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#333D4B' }}>{item.text}</div>
            </div>
          ))}
        </motion.div>

        {/* Step 3: 최종 5얼굴 통합 */}
        <motion.div style={{ position: 'absolute', opacity: step3Opacity, scale: step3Scale, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6rem', width: '100%' }}>
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
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, color: '#191F28', textAlign: 'center', letterSpacing: '-2px', lineHeight: 1.3 }}>
            나는 당신의 <span style={{ color: '#3182F6' }}>모든 모습</span>을<br/>정확히 인식합니다.
          </h1>
        </motion.div>

      </div>
    </div>
  );
}
