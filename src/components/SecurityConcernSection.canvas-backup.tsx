import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

// ── 파티클 암호화 캔버스: 얼굴 점 → 숫자 스트림 → 자물쇠 ──────────────
function ParticleEncryption({ stage }: { stage: Stage }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<Stage>(stage);
  stageRef.current = stage;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CHARS = '0123456789ABCDEF@#$%&';
    const N = 150;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let raf = 0;
    let last = performance.now();
    let stageStart = performance.now();
    let prev: Stage = stageRef.current;

    type P = {
      x: number; y: number;            // 현재 위치
      fx: number; fy: number;          // 얼굴 타깃
      lx: number; ly: number;          // 자물쇠 타깃
      sx: number; sy: number; vy: number; // 스트림(낙하)
      ch: string; chT: number;
    };
    let ps: P[] = [];
    let face: { x: number; y: number }[] = [];
    let lock: { x: number; y: number }[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = () => CHARS[(Math.random() * CHARS.length) | 0];

    function buildClouds() {
      face = [];
      lock = [];
      const cx = W / 2, cy = H / 2;

      // 얼굴 포인트 클라우드
      const rx = Math.min(W * 0.40, H * 0.42), ry = Math.min(W * 0.46, H * 0.40);
      for (let i = 0; i < 56; i++) { const a = (i / 56) * Math.PI * 2; face.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry }); }
      for (let s = -1; s <= 1; s += 2) {
        for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; face.push({ x: cx + s * rx * 0.42 + Math.cos(a) * rx * 0.13, y: cy - ry * 0.20 + Math.sin(a) * ry * 0.10 }); }
      }
      for (let i = 0; i < 10; i++) face.push({ x: cx + rand(-rx * 0.06, rx * 0.06), y: cy - ry * 0.02 + (i / 10) * ry * 0.30 });
      for (let i = 0; i < 22; i++) { const t = i / 21; face.push({ x: cx + (t - 0.5) * rx * 0.9, y: cy + ry * 0.42 + Math.sin(t * Math.PI) * ry * 0.14 }); }

      // 자물쇠 포인트 클라우드
      const bw = Math.min(W, H) * 0.42, bh = Math.min(W, H) * 0.30;
      const bTop = cy - bh * 0.12, bBot = bTop + bh, bL = cx - bw / 2, bR = cx + bw / 2;
      const per = 60;
      for (let i = 0; i < per; i++) {
        const t = i / per, p = t * 4;
        if (p < 1) lock.push({ x: bL + (bR - bL) * p, y: bTop });
        else if (p < 2) lock.push({ x: bR, y: bTop + (bBot - bTop) * (p - 1) });
        else if (p < 3) lock.push({ x: bR - (bR - bL) * (p - 2), y: bBot });
        else lock.push({ x: bL, y: bBot - (bBot - bTop) * (p - 3) });
      }
      const rs = bw * 0.28;
      for (let i = 0; i <= 24; i++) { const a = Math.PI + (i / 24) * Math.PI; lock.push({ x: cx + Math.cos(a) * rs, y: bTop + Math.sin(a) * rs }); }
      for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; lock.push({ x: cx + Math.cos(a) * bw * 0.07, y: cy + bh * 0.05 + Math.sin(a) * bw * 0.07 }); }
      for (let i = 0; i < 6; i++) lock.push({ x: cx, y: cy + bh * 0.12 + (i / 6) * bh * 0.18 });

      if (ps.length === 0) {
        for (let i = 0; i < N; i++) {
          const f = face[i % face.length];
          ps.push({ x: rand(0, W), y: rand(0, H), fx: f.x, fy: f.y, lx: 0, ly: 0, sx: 0, sy: 0, vy: 0, ch: pick(), chT: 0 });
        }
      }
      ps.forEach((p, i) => {
        const f = face[i % face.length], l = lock[i % lock.length];
        p.fx = f.x; p.fy = f.y; p.lx = l.x; p.ly = l.y;
      });
    }

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildClouds();
    }
    resize();
    window.addEventListener('resize', resize);

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const st = stageRef.current;
      if (st !== prev) {
        stageStart = now;
        if (st === 'encrypting') ps.forEach(p => { p.sx = p.x; p.sy = p.y; p.vy = rand(60, 150); });
        prev = st;
      }
      const elapsed = (now - stageStart) / 1000;
      ctx.clearRect(0, 0, W, H);

      // 캡처 단계: 스캔 라인
      let scanY = -1;
      if (st === 'capturing' || st === 'idle') {
        scanY = ((elapsed % 1.3) / 1.3) * H;
        const g = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14);
        g.addColorStop(0, 'rgba(49,130,246,0)');
        g.addColorStop(0.5, 'rgba(49,130,246,0.22)');
        g.addColorStop(1, 'rgba(49,130,246,0)');
        ctx.fillStyle = g; ctx.fillRect(0, scanY - 14, W, 28);
      }

      const stream = st === 'encrypting';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];

        if (stream) {
          // 숫자 스트림(낙하)
          p.vy += 40 * dt;
          p.sy += p.vy * dt;
          p.sx += Math.sin((now / 400) + i) * 0.4;
          if (p.sy > H + 12) { p.sy = -12; p.sx = rand(0, W); p.vy = rand(60, 150); }
          p.x = p.sx; p.y = p.sy;
          p.chT -= dt;
          if (p.chT <= 0) { p.ch = pick(); p.chT = rand(0.05, 0.18); }
          const blue = i % 3 === 0;
          ctx.fillStyle = blue ? 'rgba(37,99,235,0.95)' : 'rgba(217,119,6,0.95)';
          ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
          ctx.fillText(p.ch, p.x, p.y);
        } else {
          // 얼굴/자물쇠로 모임
          const tx = st === 'done' ? p.lx : p.fx;
          const ty = st === 'done' ? p.ly : p.fy;
          p.x += (tx - p.x) * Math.min(1, dt * 9);
          p.y += (ty - p.y) * Math.min(1, dt * 9);

          let col: string;
          if (st === 'done') col = 'rgba(22,163,74,0.95)';
          else {
            const near = scanY >= 0 && Math.abs(p.y - scanY) < 16;
            col = near ? 'rgba(29,78,216,1)' : 'rgba(49,130,246,0.85)';
          }
          const r = st === 'done' ? 2 : (scanY >= 0 && Math.abs(p.y - scanY) < 16 ? 2.6 : 1.7);
          ctx.beginPath();
          ctx.fillStyle = col;
          ctx.shadowBlur = st === 'done' ? 6 : 4;
          ctx.shadowColor = st === 'done' ? 'rgba(34,197,94,0.4)' : 'rgba(49,130,246,0.35)';
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={ref} style={{ width: '100%', height: '210px', display: 'block' }} />;
}

function EncryptionVisualizer() {
  const [stage, setStage] = useState<Stage>('idle');
  const [hash] = useState(HASH_STRING);
  const [dots, setDots] = useState('');

  const runSequence = () => {
    if (stage !== 'idle' && stage !== 'done') return;
    setStage('capturing');
    const t1 = setTimeout(() => setStage('encrypting'), 2200);
    const t2 = setTimeout(() => setStage('done'), 4600);
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
        {/* 배경 격자 */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'linear-gradient(rgba(49,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(49,130,246,1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* 파티클 캔버스 */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <ParticleEncryption stage={stage} />
        </div>

        {/* 상태 텍스트 */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginTop: '0.5rem' }}>
          <AnimatePresence mode="wait">
            {(stage === 'idle' || stage === 'capturing') && (
              <motion.div key="cap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ color: '#3182F6', fontWeight: 700, fontSize: '0.9rem' }}>
                얼굴 데이터 캡처 중...
              </motion.div>
            )}
            {stage === 'encrypting' && (
              <motion.div key="enc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ color: '#D97706', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                  숫자로 변환·암호화 중{dots}
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

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function SecurityConcernSection() {
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

        {/* 보안 레이어 — 좌/우/좌 슬라이드인, 항상 펼쳐진 비중있는 카드 */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            style={{ color: '#8B95A1', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textAlign: 'center' }}
          >
            3단계 보안 구조
          </motion.div>

          {LAYERS.map((layer, i) => {
            const fromLeft = i % 2 === 0; // 0,2 → 왼쪽 / 1 → 오른쪽
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: fromLeft ? -90 : 90, scale: 0.96 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: false, margin: '-80px' }}
                transition={{ duration: 0.65, delay: i * 0.18, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                style={{
                  background: '#FFFFFF',
                  borderTop: '1px solid #EEF0F3',
                  borderRight: '1px solid #EEF0F3',
                  borderBottom: '1px solid #EEF0F3',
                  borderLeft: `4px solid ${layer.color}`,
                  borderRadius: '20px',
                  padding: '1.5rem 1.6rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1.25rem',
                  boxShadow: `0 8px 24px rgba(0,0,0,0.06)`,
                }}
              >
                {/* 아이콘 + 단계 번호 */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '16px',
                    background: `${layer.color}18`,
                    border: `1px solid ${layer.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.7rem',
                  }}>
                    {layer.icon}
                  </div>
                  <div style={{
                    color: layer.color, fontWeight: 900, fontSize: '0.72rem',
                    letterSpacing: '0.5px', fontFamily: 'monospace',
                  }}>
                    0{i + 1}
                  </div>
                </div>

                {/* 내용 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: layer.color, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    {layer.sub}
                  </div>
                  <div style={{ color: '#191F28', fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.4px', marginBottom: '0.55rem' }}>
                    {layer.title}
                  </div>
                  <p style={{ color: '#6B7684', fontSize: '0.88rem', lineHeight: 1.65, margin: 0, letterSpacing: '-0.2px' }}>
                    {layer.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 하단 신뢰 지표 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            width: '100%',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1.1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <div style={{ fontSize: '1.8rem' }}>🏆</div>
          <div>
            <div style={{ color: '#16A34A', fontWeight: 900, fontSize: '1rem' }}>
              서비스 출시 이후 단 0건의 데이터 유출
            </div>
            <div style={{ color: '#6B7684', fontSize: '0.78rem', marginTop: '2px' }}>
              금융보안원 인증 · ISO 27001 취득 · 오인식률 1/100만
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
