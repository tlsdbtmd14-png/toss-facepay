import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
// Step 0: 오늘 점심 (인트로)
// ─────────────────────────────────────────────
function IntroVisual() {
  const friends = ['👩', '👨', '👩‍🦱'];
  return (
    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.55, delay: 0.05 }}
        style={{ fontSize: '5.5rem', lineHeight: 1 }}
      >
        🍽️
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}
      >
        {friends.map((f, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.1, type: 'spring', bounce: 0.4 }}
            style={{ fontSize: '2.2rem' }}
          >
            {f}
          </motion.span>
        ))}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        style={{ color: '#6B7684', marginTop: '1rem', fontSize: '0.95rem', lineHeight: 1.6 }}
      >
        친구 3명과 함께<br />삼겹살집으로 향했습니다
      </motion.p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 1: 맛있게 식사
// ─────────────────────────────────────────────
function FoodVisual() {
  const foods = [
    { emoji: '🥩', label: '삼겹살' },
    { emoji: '🍚', label: '공기밥' },
    { emoji: '🍜', label: '냉면' },
    { emoji: '🥤', label: '콜라' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', padding: '0.5rem 0 1.25rem' }}>
        {foods.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: 'spring', bounce: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}
          >
            <span style={{ fontSize: '2.8rem' }}>{f.emoji}</span>
            <span style={{ color: '#8B95A1', fontSize: '0.75rem', fontWeight: 600 }}>{f.label}</span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        style={{
          background: '#F2F4F6',
          borderRadius: '14px',
          padding: '0.9rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '1.3rem' }}>😋 </span>
        <span style={{ color: '#191F28', fontWeight: 700, fontSize: '1rem' }}>
          "역대급으로 맛있었다..."
        </span>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 2: 계산서 도착
// ─────────────────────────────────────────────
function ReceiptVisual() {
  const items = [
    { name: '삼겹살 4인분', price: '60,000원' },
    { name: '물냉면 2개', price: '16,000원' },
    { name: '공기밥 4개', price: '4,000원' },
    { name: '콜라 2개', price: '4,000원' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.3 }}
      style={{
        background: 'white',
        borderRadius: '18px',
        padding: '1.5rem',
        maxWidth: '300px',
        width: '100%',
        margin: '0 auto',
        border: '1px solid #EEF0F3',
        boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed #e2e8f0' }}>
        <span style={{ fontSize: '1.4rem' }}>🏮</span>
        <div>
          <div style={{ fontWeight: 800, color: '#191F28', fontSize: '0.9rem' }}>오늘도 행복 고깃집</div>
          <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>2026.05.31 · Table 7</div>
        </div>
      </div>

      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', color: '#4e5968', fontSize: '0.85rem' }}
        >
          <span>{item.name}</span>
          <span>{item.price}</span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0 0', marginTop: '0.5rem', borderTop: '2px solid #191F28', fontWeight: 900, fontSize: '1rem', color: '#191F28' }}
      >
        <span>합계</span><span>84,000원</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7, type: 'spring', bounce: 0.45 }}
        style={{ marginTop: '1rem', background: '#EBF5FF', borderRadius: '12px', padding: '1rem', textAlign: 'center' }}
      >
        <div style={{ color: '#3182f6', fontWeight: 900, fontSize: '1.25rem' }}>1인당 21,000원</div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Step 3: 친구들 카드 꺼내기
// ─────────────────────────────────────────────
function FriendsVisual() {
  const friends = [
    { emoji: '👩', name: '지현', action: '지갑 뒤지는 중...', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', cardLabel: 'VISA *1234' },
    { emoji: '👨', name: '준혁', action: '핀번호 입력 중...', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', cardLabel: 'MASTER *5678' },
    { emoji: '👩‍🦱', name: '수진', action: '카카오페이 켜는 중...', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', cardLabel: '카카오페이' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {friends.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', bounce: 0.4 }}
            style={{
              background: '#F7F8FA',
              border: '1px solid #EEF0F3',
              borderRadius: '18px',
              padding: '1.1rem 0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '95px',
            }}
          >
            <span style={{ fontSize: '2.2rem' }}>{f.emoji}</span>
            <div style={{ background: f.gradient, borderRadius: '6px', padding: '5px 8px', fontSize: '0.55rem', color: 'white', fontFamily: 'monospace', width: '76px', boxShadow: '0 3px 8px rgba(0,0,0,0.25)' }}>
              {f.cardLabel}
            </div>
            <span style={{ color: '#191F28', fontWeight: 700, fontSize: '0.82rem' }}>{f.name}</span>
            <span style={{ color: '#8B95A1', fontSize: '0.68rem', textAlign: 'center', lineHeight: 1.4 }}>{f.action}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: '1.25rem', textAlign: 'center', color: '#4E5968', fontSize: '1rem', fontWeight: 700 }}
      >
        그럼 나는?  👀
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 4: 결제 속도 비교
// ─────────────────────────────────────────────
function ComparisonVisual() {
  const methods = [
    { icon: '💵', label: '현금', time: '25초', pct: 100, highlight: false },
    { icon: '💳', label: '카드',  time: '8초',  pct: 65,  highlight: false },
    { icon: '📱', label: '앱결제', time: '3초',  pct: 35,  highlight: false },
    { icon: '👤', label: '얼굴인식', time: '0.3초', pct: 9, highlight: true },
  ];
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {methods.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.14 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}
        >
          <span style={{ fontSize: '1.1rem', width: '26px', textAlign: 'center' }}>{m.icon}</span>
          <span style={{ color: m.highlight ? '#191F28' : '#6B7684', fontSize: '0.8rem', fontWeight: m.highlight ? 800 : 500, width: '56px', flexShrink: 0 }}>{m.label}</span>
          <div style={{ flex: 1, height: '10px', background: '#EEF0F3', borderRadius: '100px', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${m.pct}%` }}
              transition={{ delay: i * 0.14 + 0.25, duration: 0.9, ease: 'easeOut' }}
              style={{
                height: '100%',
                borderRadius: '100px',
                background: m.highlight
                  ? 'linear-gradient(90deg, #3182f6, #60a5fa)'
                  : '#C4CDD5',
                boxShadow: m.highlight ? '0 0 12px rgba(96,165,250,0.5)' : 'none',
              }}
            />
          </div>
          <span style={{
            fontSize: '0.82rem',
            fontWeight: m.highlight ? 900 : 400,
            color: m.highlight ? '#3182F6' : '#ADB5BD',
            width: '38px',
            textAlign: 'right',
          }}>
            {m.time}
          </span>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, type: 'spring', bounce: 0.5 }}
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.2rem'
        }}
      >
        <span style={{ color: '#8B95A1', fontSize: '0.85rem', fontWeight: 600 }}>현금 결제 소요 시간 대비</span>
        <div style={{ 
          display: 'flex', 
          alignItems: 'baseline', 
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #3182F6, #1B64DA)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2rem',
          fontWeight: 900,
          letterSpacing: '-1px'
        }}>
          83배 <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>더 빠릅니다</span>
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 5: 결제 완료 + 다음 섹션 브릿지
// ─────────────────────────────────────────────
function SuccessVisual() {
  return (
    <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.6, delay: 0.1 }}
        style={{
          width: '72px', height: '72px',
          background: '#3182F6',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          fontSize: '2.5rem',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 24px rgba(49,130,246,0.3)',
        }}
      >
        ✓
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div style={{ color: '#191F28', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>결제 완료</div>
        <div style={{ color: '#191F28', fontWeight: 900, fontSize: '2.8rem', letterSpacing: '-1.5px', lineHeight: 1 }}>21,000<span style={{ fontSize: '1.6rem', fontWeight: 700, marginLeft: '2px' }}>원</span></div>
        <div style={{ color: '#6B7684', fontSize: '0.95rem', marginTop: '0.8rem', fontWeight: 500 }}>오늘도 행복 고깃집</div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        style={{
          marginTop: '2.5rem',
          background: '#F9FAFB',
          border: '1px solid #EEF0F3',
          borderRadius: '16px',
          padding: '1.2rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: '42px', height: '42px', background: '#E8F3FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
            🪙
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#4E5968', fontSize: '0.85rem', fontWeight: 600 }}>토스포인트 적립</div>
            <div style={{ color: '#3182F6', fontSize: '1.1rem', fontWeight: 800 }}>+188원</div>
          </div>
        </div>
        <div style={{ color: '#8B95A1', fontSize: '0.8rem', fontWeight: 600, background: '#EEF0F3', padding: '6px 10px', borderRadius: '8px' }}>
          0.3초 결제
        </div>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Step 6: 활용처 안내 (새로운 마지막 페이지)
// ─────────────────────────────────────────────
function UsageVisual() {
  const places = [
    { icon: '☕', name: '카페', desc: '커피 한 잔 살 때' },
    { icon: '🏪', name: '편의점', desc: '가벼운 산책길에' },
    { icon: '📚', name: '서점', desc: '책 한 권 고를 때' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {places.map((place, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, type: 'spring', bounce: 0.4 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: '#F9FAFB',
            padding: '1.2rem',
            borderRadius: '16px',
            border: '1px solid #F2F4F6'
          }}
        >
          <div style={{ fontSize: '2.5rem', background: '#FFFFFF', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {place.icon}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#191F28', fontWeight: 800, fontSize: '1.1rem' }}>{place.name}</span>
            <span style={{ color: '#6B7684', fontSize: '0.85rem', marginTop: '2px' }}>{place.desc}</span>
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ textAlign: 'center', marginTop: '0.5rem', color: '#3182F6', fontWeight: 700, fontSize: '0.95rem' }}
      >
        이제 두 손 가볍게 외출하세요! 🏃‍♂️
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
const STEPS = [
  { scene: '🍽️', title: '오늘 점심',      subtitle: '친구들과 삼겹살집으로',            visual: <IntroVisual />,      cta: '식사 시작 →' },
  { scene: '🥩', title: '맛있게 먹었다!',   subtitle: '삼겹살, 냉면, 공기밥... 완벽한 한 끼', visual: <FoodVisual />,       cta: '다 먹었어요 →' },
  { scene: '🧾', title: '계산서가 왔다',    subtitle: '자, 이제 누가 어떻게 낼까?',         visual: <ReceiptVisual />,    cta: '결제해보자 →' },
  { scene: '💳', title: '친구들 반응',      subtitle: '다들 카드를 꺼내기 시작했다',         visual: <FriendsVisual />,    cta: '나는? →' },
  { scene: '😎', title: '나는 지갑 없이 얼굴로!', subtitle: '카드 찾는 시간에 이미 결제 완료',      visual: <ComparisonVisual />, cta: '결제 완료 화면 보기 →' },
  { scene: '✅', title: '결제 완료!',       subtitle: '현금/카드보다 압도적으로 편합니다',         visual: <SuccessVisual />,    cta: '어디서 쓸 수 있나요? →' },
  { scene: '🌍', title: '어디서든 얼굴 하나로', subtitle: '식당은 물론 일상 곳곳에서',          visual: <UsageVisual />,      cta: '처음부터 다시보기 ↩', isLast: true },
] as const;

const variants = {
  enter: (dir: number) => ({ x: dir * 70, opacity: 0, scale: 0.97 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -70, opacity: 0, scale: 0.97 }),
};

export default function SituationSection() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next < 0 ? 0 : next >= STEPS.length ? 0 : next);
  };

  const goNext = () => {
    const isLast = step === STEPS.length - 1;
    if (isLast) {
      go(0);
    } else {
      go(step + 1);
    }
  };
  const goPrev = () => go(step - 1);

  const current = STEPS[step];

  return (
    <section
      className="story-section"
      data-bgcolor="#F3F4F6"
      style={{ minHeight: '100vh', justifyContent: 'center', padding: '8vh 20px', margin: 0, background: 'transparent' }}
    >
      {/* 스텝 진행 바 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '2rem', zIndex: 10 }}>
        {STEPS.map((_, i) => (
          <motion.div
            key={i}
            onClick={() => go(i)}
            animate={{
              width: i === step ? 32 : 8,
              background: i <= step ? '#3182F6' : '#E5E8EB',
            }}
            transition={{ duration: 0.3 }}
            style={{ height: '8px', borderRadius: '100px', cursor: 'pointer' }}
          />
        ))}
      </div>

      {/* 카페 브릿지 멘트 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <span style={{
          background: '#F0F7FF',
          color: '#3182F6',
          padding: '0.5rem 1.25rem',
          borderRadius: '100px',
          fontWeight: 800,
          fontSize: '0.95rem',
          boxShadow: '0 4px 12px rgba(49,130,246,0.1)'
        }}>
          밥 먹고 커피는 국룰, 점심값 결제부터 카페까지 ☕
        </span>
      </motion.div>

      {/* 메인 카드 */}
      <div style={{ width: '90%', maxWidth: '480px', position: 'relative' }}>
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            style={{
              background: '#FFFFFF',
              border: '1px solid #EEF0F3',
              borderRadius: '28px',
              padding: '2.2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.1rem',
              boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
            }}
          >
            {/* 씬 이모지 */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: 'spring', bounce: 0.5 }}
              style={{ fontSize: '2.2rem', lineHeight: 1 }}
            >
              {current.scene}
            </motion.div>

            {/* 텍스트 */}
            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                color: '#191F28',
                fontWeight: 900,
                fontSize: 'clamp(1.5rem,5vw,2rem)',
                margin: 0,
                letterSpacing: '-0.5px',
                lineHeight: 1.2,
              }}>
                {current.title}
              </h2>
              {current.subtitle && (
                <p style={{ color: '#6B7684', margin: '0.4rem 0 0', fontSize: '0.9rem', lineHeight: 1.55 }}>
                  {current.subtitle}
                </p>
              )}
            </div>

            {/* 비주얼 */}
            <div style={{ width: '100%' }}>
              {current.visual}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 네비게이션 버튼 */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', alignItems: 'center', zIndex: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* 이전 버튼 (첫 단계 제외) */}
        {step > 0 && step < STEPS.length - 1 && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={goPrev}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: '#F2F4F6',
              border: 'none',
              color: '#4E5968',
              padding: '0.72rem 1.4rem',
              borderRadius: '100px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.88rem',
            }}
          >
            ← 이전
          </motion.button>
        )}

        {/* 메인 CTA */}
        <motion.button
          onClick={goNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: '#3182F6',
            border: 'none',
            color: 'white',
            padding: '0.85rem 2rem',
            borderRadius: '100px',
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.95rem',
            boxShadow: '0 8px 24px rgba(49,130,246,0.32)',
            letterSpacing: '-0.2px',
          }}
        >
          {current.cta}
        </motion.button>
      </div>

      {/* 스텝 카운터 */}
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: '1rem', color: '#ADB5BD', fontSize: '0.78rem', zIndex: 10 }}
      >
        {step + 1} / {STEPS.length}
      </motion.div>
    </section>
  );
}
