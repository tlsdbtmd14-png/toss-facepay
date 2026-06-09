import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';

// ── 암호화 해시 문자열 생성기 ──────────────────────────────────────
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%&';
const makeHash = (len = 32) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// ── 스크램블 텍스트 컴포넌트 ──────────────────────────────────────
function ScrambleText({ text, running }: { text: string; running: boolean }) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number>(0);
  const iteration = useRef(0);

  useEffect(() => {
    if (!running) { setDisplay(text); return; }
    iteration.current = 0;
    const animate = () => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (i < iteration.current) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      if (iteration.current < text.length) {
        iteration.current += 0.4;
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, text]);

  return <span>{display}</span>;
}

// ── 암호화 과정 시각화 ────────────────────────────────────────────
type Stage = 'idle' | 'capturing' | 'encrypting' | 'done';

const HASH_STRING = '8f3K#mP9@xQ2$nL7!rY4&wZ6%bJ1*vD';

// ── 3D 이미지 프로세스 다이어그램: 얼굴 → 메시 → 자물쇠 ──────────────
const STEP_IMG = ['/얼굴인식.png', '/데이터변환2.png', '/암호화과정.png'];
const STEP_LABEL = ['얼굴 인식', '데이터 변환', '암호화 저장'];

const stageIndex = (s: Stage) =>
  ({ idle: 0, capturing: 0, encrypting: 1, done: 2 } as Record<Stage, number>)[s];

function ProcessDiagram({ cur }: { cur: number }) {
  return (
    <div style={{ position: 'relative', height: '600px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* 하단 진행 점 (크기 확대) */}
      <div style={{ position: 'absolute', bottom: 0, display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ width: i === cur ? 30 : 8, background: i <= cur ? '#3182F6' : '#D6E4F5' }}
            transition={{ duration: 0.3 }}
            style={{ height: 8, borderRadius: '100px' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur}
          initial={{ opacity: 0, scale: 0.82, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: -20 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
        >
          <div style={{ position: 'relative', width: '480px', height: '480px' }}>
            {/* 글로우 */}
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.9, 1.06, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: '8%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(49,130,246,0.4) 0%, rgba(49,130,246,0) 70%)',
                filter: 'blur(16px)', zIndex: 0,
              }}
            />
            {/* 이미지 (부유) */}
            <div style={{
               position: 'relative', zIndex: 1, width: '100%', height: '100%',
               display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <motion.img
                src={STEP_IMG[cur]}
                alt={STEP_LABEL[cur]}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: cur === 1 ? '160%' : '100%',
                  height: cur === 1 ? '160%' : '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>

          {/* STEP 라벨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{
              background: '#3182F6', color: '#FFFFFF', fontWeight: 800,
              fontSize: '1rem', padding: '4px 14px', borderRadius: '100px', letterSpacing: '0.5px',
            }}>
              STEP {cur + 1}
            </span>
            <span style={{ color: '#191F28', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>
              {STEP_LABEL[cur]}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EncryptionVisualizer({ scrollContainer }: { scrollContainer?: React.RefObject<HTMLElement> }) {
  const localRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: localRef,
    container: scrollContainer,
    offset: ['start center', 'end center']
  });

  const [cur, setCur] = useState(-1); // -1 means nothing visible yet

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.1) setCur(-1);
    else if (latest < 0.4) setCur(0);
    else if (latest < 0.7) setCur(1);
    else setCur(2);
  });

  // Clamp cur for the ProcessDiagram which expects 0, 1, or 2
  const diagramCur = cur < 0 ? 0 : cur;

  return (
    <div ref={localRef} style={{ height: '300vh', position: 'relative' }}>
      
      {/* Sticky Container */}
      <div style={{ position: 'sticky', top: '20vh', width: '95%', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* 자연스러운 플로팅 레이아웃 (대시보드 제거) */}
        <div style={{
          display: 'flex',
          gap: '5rem',
          alignItems: 'center',
          position: 'relative'
        }}>

          {/* 좌측: 스크롤 텔링 텍스트 패널 */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingRight: '2rem'
          }}>

            {/* 3단계 프로세스 텍스트 (색상 변경 없이 부드럽게 떠오르는 애니메이션) */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.65)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: '32px',
              padding: '3.5rem 3rem',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '2.5rem',
            }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: cur >= 0 ? 1 : 0, y: cur >= 0 ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#191F28',
                  lineHeight: 1.5,
                  wordBreak: 'keep-all',
                }}
              >
                최초 얼굴 등록 시, 얼굴의 특징점과 선을 수치화하고
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: cur >= 1 ? 1 : 0, y: cur >= 1 ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#191F28',
                  lineHeight: 1.5,
                  wordBreak: 'keep-all',
                }}
              >
                암호화된 데이터로 변환하여 인터넷이 연결되지 않은 안전한 토스 서버에만 저장됩니다.
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: cur >= 2 ? 1 : 0, y: cur >= 2 ? 0 : 40 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                style={{
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  color: '#191F28',
                  lineHeight: 1.5,
                  wordBreak: 'keep-all',
                }}
              >
                결제 매장의 단말기나 서버에는 고객의 얼굴 정보가 절대 남지 않습니다.
              </motion.div>
            </div>
            
          </div>

          {/* 우측: 3D 비주얼 패널 (거대한 이미지) */}
          <div style={{
            flex: 1.2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <ProcessDiagram cur={diagramCur} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 보안 레이어 카드 ──────────────────────────────────────────────
const LAYERS = [
  {
    iconBefore: '🎭',
    iconAfter: '🛡️',
    color: '#3182f6',
    title: '가짜 얼굴로는 절대 뚫을 수 없습니다',
    sub: '실시간 안면 위변조 검증',
    desc: '전용 단말기 \'토스 프론트\'의 정교한 스캐닝과 라이브니스(Liveness) 기술이 눈 깜빡임과 미세한 움직임을 감지해 사진이나 영상을 통한 위조를 원천 차단합니다. 또한, 얼굴의 기하학적 굴곡 깊이까지 계산하여 화장이나 헤어스타일 변화는 물론 쌍둥이까지 정확하게 구분해 냅니다.',
  },
  {
    iconBefore: '📸',
    iconAfter: '🔒',
    color: '#8b5cf6',
    title: '원본 얼굴 사진은 즉시 영구 삭제됩니다',
    sub: '암호 가치 변환 및 즉시 파기',
    desc: '촬영된 얼굴은 단말기나 클라우드에 사진 형태로 절대 저장되지 않습니다. 획득 즉시 암호화된 벡터 데이터로 변환되며, 원본 사진은 나노초(ns) 단위로 완전히 파기됩니다. 복호화가 불가능한 일방향 암호화 방식을 적용하여, 혹시라도 정보가 유출되더라도 원래 얼굴을 복원하는 것은 전산학적으로 불가능합니다.',
  },
  {
    iconBefore: '👀',
    iconAfter: '🚨',
    color: '#22c55e',
    title: '24시간 철통 감시, 의심 거래는 즉각 차단',
    sub: '실시간 이상거래탐지 (FDS)',
    desc: '단순한 얼굴 인식을 넘어, 당신의 평소 거래 맥락(결제 금액, 시간, 위치, 단말기 패턴 등)을 24시간 실시간으로 분석합니다. 만약 평소와 다른 위험하거나 의심스러운 결제 시도가 포착되면, 즉시 추가 인증을 요구하거나 한도를 낮춰 혹시 모를 신원 탈취 가능성까지 완벽하게 방어합니다.',
  },
];



// ── 보안 레이어 카드 컴포넌트 (Apple 스타일 역동적 스크롤 텔링) ──────────────────────────────────────────────
function AppleSecurityCard({ layer, index, containerRef }: { layer: any, index: number, containerRef?: React.RefObject<HTMLElement> }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: containerRef, // 전역 스크롤 컨테이너를 지정해야 스크롤이 감지됨
    offset: ['start start', 'end end'],
  });

  const [phase, setPhase] = useState(0);

  // 스크롤 진행도에 따라 페이즈 변경 (더 빨리 반응하도록 임계값 낮춤)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.4) setPhase(2);       // 텍스트 등장
    else if (latest > 0.15) setPhase(1); // 이모지 변신
    else setPhase(0);                    // 초기 상태
  });

  // 역동적인 애니메이션 설정 (Variants)
  const emojiBeforeVariants = {
    visible: { scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)' },
    hidden: { scale: 0.5, opacity: 0, rotate: -20, filter: 'blur(10px)', transition: { duration: 0.3 } }
  };
  
  const emojiAfterVariants = {
    hidden: { scale: 0.2, opacity: 0, rotate: 30, filter: 'blur(10px)' },
    visible: { scale: 1, opacity: 1, rotate: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 250, damping: 15, mass: 1.2 } }
  };

  // 텍스트 이동 애니메이션 (타이틀 좌우, 설명 상하 이동)
  const titleVariants = {
    hidden: { opacity: 0, x: -100, filter: 'blur(10px)' },
    visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const badgeVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 150, scale: 0.8, filter: 'blur(20px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 80, damping: 15, mass: 1 } }
  };

  return (
    <div
      ref={targetRef}
      style={{
        width: '100%',
        height: '300vh', // 스텝 간격을 대폭 넓힘
        backgroundColor: 'transparent',
        position: 'relative',
        marginBottom: '50vh', // 스텝과 스텝 사이의 완전한 공백 추가
      }}
    >
      <div style={{
        position: 'sticky', top: 0, height: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* 아주 옅은 배경 그라데이션 원 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vw', borderRadius: '50%',
          background: `radial-gradient(circle, ${layer.color}08 0%, transparent 60%)`,
          pointerEvents: 'none', zIndex: 0
        }} />

        <motion.div 
          animate={{ y: phase === 2 ? -40 : 0 }} // 텍스트 등장 시 전체가 위로 살짝 올라가는 모션
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '3rem', position: 'relative', zIndex: 1, padding: '0 2rem' }}
        >
          
          {/* 타이틀 영역 (좌우에서 이동해 옴) */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <motion.div 
              variants={badgeVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}
            >
              <span style={{ background: layer.color, color: '#fff', fontWeight: 800, fontSize: '0.9rem', padding: '6px 16px', borderRadius: '100px' }}>
                STEP {index + 1}
              </span>
              <span style={{ color: layer.color, fontSize: '1rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                {layer.sub}
              </span>
            </motion.div>
            
            <motion.h2 
              variants={titleVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.5 }}
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#191F28', lineHeight: 1.25, letterSpacing: '-2px', margin: 0 }}
            >
              {layer.title}
            </motion.h2>
          </div>

          {/* 중앙 이모지 애니메이션 영역 (매우 역동적) */}
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div 
              variants={emojiBeforeVariants}
              initial="visible"
              animate={phase >= 1 ? "hidden" : "visible"}
              style={{ position: 'absolute', fontSize: '10rem', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.05))' }}
            >
              {layer.iconBefore}
            </motion.div>
            
            <motion.div 
              variants={emojiAfterVariants}
              initial="hidden"
              animate={phase >= 1 ? "visible" : "hidden"}
              style={{ position: 'absolute', fontSize: '10rem', filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.15))' }}
            >
              {layer.iconAfter}
            </motion.div>
          </div>

          {/* 텍스트 영역 (부드러운 글래스모피즘 & 포인트 컬러 배경 박스) */}
          <motion.div 
            variants={descVariants}
            initial="hidden"
            animate={phase === 2 ? "visible" : "hidden"}
            style={{ 
              maxWidth: '640px',
              backgroundColor: `${layer.color}08`, // 매우 연한 포인트 컬러 배경
              border: `1px solid ${layer.color}15`, // 은은한 포인트 컬러 테두리
              padding: '2rem 2.5rem',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.01)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <p style={{ color: '#333D4B', fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', lineHeight: 1.65, margin: 0, wordBreak: 'keep-all', fontWeight: 600, letterSpacing: '-0.3px' }}>
              {layer.desc}
            </p>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function SecurityConcernSection({ containerRef }: { containerRef?: React.RefObject<HTMLElement> } = {}) {
  return (
    <div style={{ width: '100%', padding: '2rem 0' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ textAlign: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{
            color: '#191F28', fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            margin: 0, letterSpacing: '-2px', lineHeight: 1.25,
          }}>
            안심하세요,<br />
            <span style={{ color: '#3182F6' }}>절대 유출되지 않아요</span>
          </h2>
          <p style={{ color: '#6B7684', marginTop: '1.2rem', fontSize: '1.2rem', lineHeight: 1.6, fontWeight: 500, letterSpacing: '-0.3px' }}>
            당신의 얼굴 정보가 어떻게 안전하게 지켜지는지<br />3D 시뮬레이션으로 투명하게 보여드릴게요.
          </p>
        </motion.div>
      </div>

      {/* 암호화 시각화 (넓은 레이아웃을 위해 560px 제한 박스 밖으로 뺌) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        style={{ width: '100%', marginTop: '3rem' }}
      >
        <EncryptionVisualizer scrollContainer={containerRef} />
      </motion.div>

      {/* 3단계 보안 구조 카드 (스크롤 반응형 레이아웃) */}
      <div style={{ width: '100%', margin: '15rem 0 5rem 0', display: 'flex', flexDirection: 'column' }}>
        {/* 타이틀과 첫 번째 스텝 사이의 간격을 압도적으로 넓힘 (기존 6rem -> 40vh) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '40vh', padding: '0 2rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, color: '#191F28', letterSpacing: '-2px', margin: 0, textAlign: 'center', lineHeight: 1.2 }}>
            결제는 단 1초, 하지만 보안은 <br /><span style={{ color: '#3182F6' }}>24시간 내내 빈틈없이 지켜냅니다</span>
          </h1>
        </div>

        {LAYERS.map((layer, i) => (
          <AppleSecurityCard key={i} layer={layer} index={i} containerRef={containerRef} />
        ))}
      </div>

      {/* 보안 안심 Q&A 섹션 */}
      <SecurityQASection />

      {/* 하단 신뢰 지표 — 트로피 + 폭죽 이미지 */}
      <TrophySection />

    </div>
  );
}

// ── 보안 Q&A 섹션 ───────────────────────────────────────────────
function SecurityQASection() {
  return (
    <div style={{ width: '100%', maxWidth: '960px', margin: '15rem auto 8rem', padding: '0 2rem' }}>
      <motion.h3 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#191F28', marginBottom: '4rem', textAlign: 'center', letterSpacing: '-1px' }}
      >
        가장 많이 묻는 질문들
      </motion.h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Q1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
          style={{ background: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '32px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s ease' }}
        >
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3182F6', lineHeight: 1 }}>Q.</div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#191F28', margin: 0, lineHeight: 1.4, wordBreak: 'keep-all' }}>
            얼굴결제 서비스를 해지하면 제 데이터는 어떻게 되나요?
          </h4>
          <p style={{ fontSize: '1.1rem', color: '#4E5968', lineHeight: 1.6, margin: 0, wordBreak: 'keep-all', fontWeight: 500 }}>
            토스 앱에서 언제든 얼굴결제 서비스를 해지할 수 있으며, 해지 즉시 실시간 결제 기능은 완전히 중지됩니다. 단, 혹시 모를 명의도용이나 금융 사고를 방지하기 위해 얼굴 정보는 결제망과 완전히 격리된 채 1년간 안전하게 분리 보관된 후 흔적 없이 최종 폐기됩니다.
          </p>
        </motion.div>

        {/* Q2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
          style={{ background: 'rgba(255, 255, 255, 0.65)', border: '1px solid rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: '32px', padding: '3rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'all 0.3s ease' }}
        >
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3182F6', lineHeight: 1 }}>Q.</div>
          <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#191F28', margin: 0, lineHeight: 1.4, wordBreak: 'keep-all' }}>
            내 사진을 훔치거나 유출된 데이터로 남이 결제하면요?
          </h4>
          <p style={{ fontSize: '1.1rem', color: '#4E5968', lineHeight: 1.6, margin: 0, wordBreak: 'keep-all', fontWeight: 500 }}>
            암호화된 데이터를 어떻게든 알아내어 사진으로 프린트하더라도 결제에 사용할 수 없습니다. 결제 단말기에는 실제 사람의 입체적인 얼굴인지 완벽하게 걸러내는 <strong>라이브니스(Liveness) 기술</strong>이 적용되어 있기 때문입니다.
          </p>
        </motion.div>

      </div>
    </div>
  );
}

// ── 폭죽 파티클 효과 ────────────────────────────────────────────
const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F', '#BB8FCE', '#FF8C42', '#3182F6', '#22C55E'];

function ConfettiParticle({ delay, color, left, size, duration }: any) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
      animate={{
        opacity: [1, 1, 0],
        y: [0, -120 - Math.random() * 160, 80 + Math.random() * 120],
        x: [0, (Math.random() - 0.5) * 300, (Math.random() - 0.5) * 400],
        rotate: [0, Math.random() * 720 - 360],
        scale: [0, 1.2, 0.6],
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      style={{
        position: 'absolute', top: '50%', left,
        width: size, height: size * (Math.random() > 0.5 ? 1 : 2.5),
        borderRadius: Math.random() > 0.5 ? '50%' : '3px',
        background: color, pointerEvents: 'none',
      }}
    />
  );
}

function ConfettiBurst({ trigger }: { trigger: boolean }) {
  if (!trigger) return null;
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.4,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    left: `${40 + Math.random() * 20}%`,
    size: 6 + Math.random() * 8,
    duration: 1.2 + Math.random() * 0.8,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map((p) => (
        <ConfettiParticle key={p.id} {...p} />
      ))}
    </div>
  );
}

// ── 트로피 섹션 ────────────────────────────────────────────────
function TrophySection() {
  const [burst, setBurst] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBurst(false);
          setTimeout(() => setBurst(true), 100);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{
        maxWidth: '780px', margin: '6rem auto 0', padding: '0 1.5rem', width: '100%',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
        position: 'relative',
      }}
    >
      {/* 폭죽 파티클 */}
      <ConfettiBurst trigger={burst} />

      {/* 후광 효과 (Glow) */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0) 70%)',
          filter: 'blur(30px)',
          zIndex: 0,
        }}
      />

      {/* 트로피 */}
      <motion.img
        src="/image 30.png"
        alt="trophy"
        initial={{ opacity: 0, scale: 0.3, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.45 }}
        style={{ width: '360px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
      />

      {/* 텍스트 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: '1rem' }}
      >
        <div style={{ color: '#16A34A', fontWeight: 900, fontSize: '2rem', letterSpacing: '-1px', lineHeight: 1.3 }}>
          서비스 출시 이후<br />단 0건의 데이터 유출
        </div>
        <div style={{ color: '#6B7684', fontSize: '1.1rem', marginTop: '1rem', lineHeight: 1.6, fontWeight: 500 }}>
          금융보안원 인증 · ISO 27001 취득 · 오인식률 1/100만
        </div>
      </motion.div>
    </div>
  );
}
