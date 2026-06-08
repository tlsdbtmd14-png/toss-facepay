import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

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
const STEP_IMG = ['/enc-face2.png', '/enc-mesh2.png', '/enc-lock2.png'];
const STEP_LABEL = ['얼굴 인식', '데이터 변환', '암호화 과정'];

const stageIndex = (s: Stage) =>
  ({ idle: 0, capturing: 0, encrypting: 1, done: 2 } as Record<Stage, number>)[s];

function ProcessDiagram({ stage }: { stage: Stage }) {
  const cur = stageIndex(stage);
  return (
    <div style={{ position: 'relative', height: '224px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* 하단 진행 점 */}
      <div style={{ position: 'absolute', bottom: 0, display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ width: i === cur ? 22 : 6, background: i <= cur ? '#3182F6' : '#D6E4F5' }}
            transition={{ duration: 0.3 }}
            style={{ height: 6, borderRadius: '100px' }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={cur}
          initial={{ opacity: 0, scale: 0.82, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.82, y: -16 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.7rem' }}
        >
          <div style={{ position: 'relative', width: '172px', height: '172px' }}>
            {/* 글로우 */}
            <motion.div
              animate={{ opacity: [0.35, 0.65, 0.35], scale: [0.9, 1.06, 0.9] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: '8%', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(49,130,246,0.4) 0%, rgba(49,130,246,0) 70%)',
                filter: 'blur(8px)', zIndex: 0,
              }}
            />
            {/* 이미지 (부유) */}
            <motion.img
              src={STEP_IMG[cur]}
              alt={STEP_LABEL[cur]}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* STEP 라벨 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{
              background: '#3182F6', color: '#FFFFFF', fontWeight: 800,
              fontSize: '0.68rem', padding: '3px 9px', borderRadius: '100px', letterSpacing: '0.3px',
            }}>
              STEP {cur + 1}
            </span>
            <span style={{ color: '#191F28', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
              {STEP_LABEL[cur]}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function EncryptionVisualizer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [hash] = useState(HASH_STRING);
  const [dots, setDots] = useState('');

  const runSequence = () => {
    if (stage !== 'idle' && stage !== 'done') return;
    setStage('capturing');
    const t1 = setTimeout(() => setStage('encrypting'), 2400);
    const t2 = setTimeout(() => setStage('done'), 4800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  };

  // 로딩 점 애니메이션
  useEffect(() => {
    if (stage !== 'encrypting') return;
    let i = 0;
    const id = setInterval(() => { setDots('.'.repeat((i++ % 3) + 1)); }, 400);
    return () => clearInterval(id);
  }, [stage]);

  // 자동 시작
  useEffect(() => { runSequence(); }, []);

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* 파이프라인 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center' }}>
        {(['capturing', 'encrypting', 'done'] as Stage[]).map((s, i) => {
          const order = ({ idle: -1, capturing: 0, encrypting: 1, done: 2 } as Record<Stage, number>)[stage];
          // 지나간 단계 또는 마지막 완료 단계 → 체크 표시 (3번도 완료 시 체크)
          const checked = order > i || (i === 2 && stage === 'done');
          const active = order === i && !checked;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: checked ? '#22c55e' : active ? '#3182f6' : '#E5E8EB',
                border: `2px solid ${checked ? '#22c55e' : active ? '#60a5fa' : '#E5E8EB'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 800, color: checked || active ? 'white' : '#ADB5BD',
                transition: 'all 0.4s',
                boxShadow: active ? '0 0 12px rgba(49,130,246,0.5)' : 'none',
              }}>
                {checked ? '✓' : i + 1}
              </div>
              {i < 2 && (
                <div style={{
                  width: 32, height: 2,
                  background: checked ? '#22c55e' : '#E5E8EB',
                  transition: 'background 0.5s',
                  borderRadius: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* 메인 카드 */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #EEF0F3',
        borderRadius: '20px',
        padding: '1.25rem 1.25rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
      }}>
        {/* 3D 프로세스 다이어그램 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ProcessDiagram stage={stage} />
        </div>

        {/* 상태 텍스트 */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '0.75rem' }}>
          <AnimatePresence mode="wait">
            {(stage === 'idle' || stage === 'capturing') && (
              <motion.div key="cap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ color: '#3182F6', fontWeight: 700, fontSize: '0.9rem' }}>
                얼굴을 인식하고 있어요
              </motion.div>
            )}
            {stage === 'encrypting' && (
              <motion.div key="enc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ color: '#D97706', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  얼굴을 고유한 숫자로 변환·암호화 중{dots}
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.72rem',
                  color: '#3182F6', letterSpacing: '1px',
                  wordBreak: 'break-all', padding: '0.5rem',
                  background: '#EBF5FF', borderRadius: '8px',
                }}>
                  <ScrambleText text={hash} running={true} />
                </div>
              </motion.div>
            )}
            {stage === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div style={{ color: '#16A34A', fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.6rem' }}>
                  암호화 완료 — 원본은 즉시 삭제됩니다
                </div>
                <div style={{
                  fontFamily: 'ui-monospace, monospace', fontSize: '0.7rem',
                  color: '#8B95A1', letterSpacing: '1px',
                  wordBreak: 'break-all', padding: '0.5rem',
                  background: '#F2F4F6', borderRadius: '8px', marginBottom: '0.6rem',
                }}>
                  {hash}
                </div>
                <div style={{
                  background: '#FEF2F2', border: '1px solid #FECACA',
                  borderRadius: '10px', padding: '0.55rem 0.85rem',
                  color: '#DC2626', fontSize: '0.75rem', fontWeight: 600,
                }}>
                  😈 해커가 이걸 훔쳐가도... 얼굴로 되돌릴 수 없습니다
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 다시 실행 버튼 */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <motion.button
          className="enc-replay"
          onClick={runSequence}
          disabled={stage !== 'idle' && stage !== 'done'}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: '#F2F4F6',
            border: 'none',
            color: '#4E5968',
            padding: '0.55rem 1.5rem',
            borderRadius: '100px',
            cursor: stage === 'done' || stage === 'idle' ? 'pointer' : 'not-allowed',
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {stage === 'done' || stage === 'idle' ? '↩ 다시 보기' : '처리 중...'}
        </motion.button>
      </div>
    </div>
  );
}

// ── 보안 레이어 카드 ──────────────────────────────────────────────
const LAYERS = [
  {
    icon: '📱',
    color: '#3182f6',
    title: '기기 안에서만 처리',
    sub: 'Secure Enclave',
    desc: '얼굴 인식은 100% 기기 내부 보안칩에서만 처리됩니다. 원본 데이터가 외부 서버로 전송되는 일은 없습니다.',
  },
  {
    icon: '🔢',
    color: '#8b5cf6',
    title: '단방향 수학 암호화',
    sub: 'One-way Hash',
    desc: '얼굴 → 숫자로만 변환됩니다. 수학적으로 역산이 불가능해 해시값만으로는 얼굴을 복원할 수 없습니다.',
  },
  {
    icon: '🗑️',
    color: '#22c55e',
    title: '원본 즉시 삭제',
    sub: 'Zero Retention',
    desc: '캡처된 얼굴 이미지는 암호화 직후 기기에서 완전히 삭제됩니다. 저장되는 건 해시 코드뿐입니다.',
  },
];



// ── 보안 레이어 풀스크린 슬레이트 컴포넌트 ──────────────────────────────────────────────
function SecuritySlate({ layer, index, scrollYProgress }: any) {
  // 스크롤 구간 계산 (0.2 ~ 0.4 / 0.45 ~ 0.65 / 0.7 ~ 0.9)
  const start = 0.20 + index * 0.25;
  const end = start + 0.2;

  // 좌측(-90) 우측(90) 좌측(-90) 교차
  const startAngle = index % 2 === 0 ? -90 : 90;
  const origin = index % 2 === 0 ? 'top left' : 'top right';

  const rotate = useTransform(scrollYProgress, [start, end], [startAngle, 0]);

  // 대기 중일 때 그림자 숨김 처리 (Bleeding 방지)
  const shadowOpacity = useTransform(scrollYProgress, [start, start + 0.05], [0, 0.2]);
  const boxShadow = useMotionTemplate`-10px 10px 40px rgba(0,0,0,${shadowOpacity})`;

  // 배경은 각 액센트 컬러에 맞는 부드러운 톤
  const bg = index === 0 ? '#EAF3FF' : index === 1 ? '#F3E8FF' : '#EBF9F1';

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: bg,
        transformOrigin: origin,
        rotate,
        zIndex: index + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow,
        overflow: 'hidden',
        pointerEvents: useTransform(scrollYProgress, (v) => v >= end - 0.05 ? 'auto' : 'none'),
      }}
    >
      <div style={{
        position: 'absolute', top: '-10vh', [origin.includes('left') ? 'right' : 'left']: '-10vw',
        width: '60vw', height: '60vw', borderRadius: '50%',
        background: `radial-gradient(circle, ${layer.color}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ width: '100%', maxWidth: '1000px', padding: '0 2rem', display: 'flex', gap: '4rem', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <span style={{ background: layer.color, color: '#fff', fontWeight: 800, fontSize: '0.9rem', padding: '6px 16px', borderRadius: '100px' }}>
              STEP {index + 1}
            </span>
            <span style={{ color: layer.color, fontSize: '1rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              {layer.sub}
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, color: '#191F28', lineHeight: 1.25, letterSpacing: '-2px', margin: '0 0 1.5rem 0' }}>
            {layer.title}
          </h2>
          <p style={{ color: '#4E5968', fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', lineHeight: 1.6, margin: 0 }}>
            {layer.desc}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '8rem', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.1))' }}>
            {layer.icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function SecurityConcernSection({ containerRef }: { containerRef?: React.RefObject<HTMLElement> } = {}) {
  const scrollContainerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    container: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div style={{ width: '100%', padding: '2rem 0' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>

        {/* 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center' }}
        >
          <h2 style={{
            color: '#191F28', fontWeight: 900,
            fontSize: 'clamp(1.7rem, 5vw, 2.6rem)',
            margin: 0, letterSpacing: '-1px', lineHeight: 1.2,
          }}>
            내 얼굴 데이터가<br />유출되면 어쩌죠?
          </h2>
          <p style={{ color: '#6B7684', marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
            실제로 어떻게 처리되는지 직접 보여드릴게요
          </p>
        </motion.div>

        {/* 암호화 시각화 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{ width: '100%' }}
        >
          <EncryptionVisualizer />
        </motion.div>

      </div>

      {/* 3단계 보안 구조 카드 — 풀스크린 슬레이트 애니메이션 적용 */}
      <section 
        ref={scrollContainerRef}
        style={{ height: '500vh', position: 'relative', width: '100%', margin: '50vh 0', display: 'block' }}
      >
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden', background: 'transparent' }}>
          
          {/* 뒷배경 텍스트 */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 0 }}>
            <div style={{ display: 'inline-block', background: '#EEF0F3', color: '#4E5968', padding: '0.5rem 1.5rem', borderRadius: '100px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '2rem' }}>
              🔒 철저한 3단계 보안
            </div>
            <h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 6rem)', fontWeight: 900, color: '#191F28', letterSpacing: '-2px', margin: 0, textAlign: 'center' }}>
              안심하세요, <br /><span style={{ color: '#3182F6' }}>절대 유출되지 않아요</span>
            </h1>
            <motion.div
               animate={{ y: [0, 10, 0] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
               style={{ marginTop: '4rem', color: '#ADB5BD', fontSize: '2rem' }}
            >
              ↓
            </motion.div>
          </div>

          {/* 떨어지는 슬레이트들 */}
          {LAYERS.map((layer, i) => (
            <SecuritySlate key={i} layer={layer} index={i} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </section>

      {/* 하단 신뢰 지표 — 트로피 + 폭죽 이미지 */}
      <TrophySection />

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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        <div style={{ color: '#16A34A', fontWeight: 900, fontSize: '1.6rem', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
          서비스 출시 이후<br />단 0건의 데이터 유출
        </div>
        <div style={{ color: '#6B7684', fontSize: '0.9rem', marginTop: '0.6rem', lineHeight: 1.6 }}>
          금융보안원 인증 · ISO 27001 취득 · 오인식률 1/100만
        </div>
      </motion.div>
    </div>
  );
}
