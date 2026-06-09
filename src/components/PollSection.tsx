import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityConcernSection from './SecurityConcernSection';
import RecognitionConcernSection from './RecognitionConcernSection';

const ease = [0.16, 1, 0.3, 1] as const;

// 사이트 배경과 동일한 라이트 그라데이션
const LIGHT_BG =
  'radial-gradient(ellipse 60% 55% at 18% 22%, rgba(110,170,255,0.45) 0%, rgba(110,170,255,0) 60%),' +
  'radial-gradient(ellipse 70% 55% at 82% 90%, rgba(70,140,255,0.4) 0%, rgba(70,140,255,0) 58%),' +
  'radial-gradient(ellipse 55% 50% at 60% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%),' +
  'linear-gradient(125deg, #dcebff 0%, #f4f9ff 50%, #eaf3ff 100%)';

type ModalType = 'security' | 'recognition' | null;
type View = 'poll' | 'explore';

// 아이콘
const Chevron = ({ color = '#3182F6', size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const BackArrow = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
    <path d="M15 6L9 12L15 18" stroke="#191F28" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CheckMini = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="m5 12 4.5 4.5L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 걱정 항목 (1·2번이 가장 많았던 걱정 + 각자 연결 페이지)
const OPTIONS: { text: string; fill: number; top: boolean; modal?: ModalType }[] = [
  { text: '내 얼굴 데이터, 안전한가요?', fill: 100, top: true, modal: 'security' },
  { text: '인식이 잘 안되면 어쩌죠?', fill: 82, top: true, modal: 'recognition' },
  { text: '금융사고가 일어날 것 같음', fill: 40, top: false },
  { text: '단말기에 얼굴 노출 부담', fill: 26, top: false },
];

export default function PollSection() {
  const [view, setView] = useState<View>('poll');
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (i: number) => {
    if (revealed) return;
    setPicked(i);
    setRevealed(true);
    // 결과(제일 많았어요)를 보여준 뒤 → 화면 전환
    timerRef.current = setTimeout(() => setView('explore'), 2600);
  };

  const resetVote = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setView('poll');
    setRevealed(false);
    setPicked(null);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = modal ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modal]);

  // 모달 간 이동 시 스크롤 최상단으로 리셋
  useEffect(() => {
    if (modal && modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [modal]);

  const topOptions = OPTIONS.filter((o) => o.top);

  return (
    <>
      <section className="story-section" data-bgcolor="#F9FAFB" style={{ minHeight: '100vh', justifyContent: 'center', padding: '10vh 1.5rem', background: 'transparent' }}>
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.7, ease }}
          layout
          style={{
            width: '100%',
            maxWidth: '800px',
            background: '#FFFFFF',
            borderRadius: '28px',
            padding: '2.8rem 2.5rem',
            boxShadow: '0 16px 48px rgba(0,0,0,0.06)',
            border: '1px solid #EEF0F3',
            overflow: 'hidden',
          }}
        >
          <AnimatePresence mode="wait">
            {/* ───────── 투표 화면 ───────── */}
            {view === 'poll' && (
              <motion.div
                key="poll"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4, ease }}
              >
                <h2 style={{
                  color: '#191F28',
                  fontSize: 'clamp(1.4rem, 4.5vw, 1.7rem)',
                  fontWeight: 800,
                  margin: '0 0 1.75rem',
                  lineHeight: 1.35,
                  letterSpacing: '-0.6px',
                }}>
                  이런 걱정<br />드시지 않으셨나요?
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {OPTIONS.map((opt, idx) => {
                    const isPicked = picked === idx;
                    const isTop = revealed && opt.top;
                    return (
                      <motion.div
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        whileHover={!revealed ? { scale: 1.015 } : {}}
                        whileTap={!revealed ? { scale: 0.985 } : {}}
                        animate={isPicked ? { scale: [1, 1.03, 1] } : {}}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: 'relative',
                          background: isPicked ? '#F0F7FF' : '#FFFFFF',
                          border: `2px solid ${isPicked ? '#3182F6' : isTop ? '#CFE4FF' : '#EEF0F3'}`,
                          borderRadius: '16px',
                          padding: '1.15rem 1.25rem',
                          cursor: revealed ? 'default' : 'pointer',
                          textAlign: 'left',
                          transition: 'border-color 0.35s ease, background 0.35s ease',
                          boxShadow: isPicked ? '0 6px 18px rgba(49,130,246,0.18)' : 'none',
                        }}
                      >
                        {revealed && (
                          <div style={{ position: 'absolute', inset: 0, borderRadius: '14px', overflow: 'hidden', zIndex: 0 }}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${opt.fill}%` }}
                              transition={{ duration: 1.1, ease, delay: 0.05 }}
                              style={{
                                position: 'absolute', top: 0, left: 0, bottom: 0,
                                background: isPicked
                                  ? 'rgba(49,130,246,0.18)'
                                  : opt.top ? 'rgba(49,130,246,0.1)' : 'rgba(0,0,0,0.035)',
                              }}
                            />
                          </div>
                        )}

                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          {isPicked && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', bounce: 0.5 }}
                              style={{
                                width: 22, height: 22, borderRadius: '50%',
                                background: '#3182F6', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}
                            >
                              <CheckMini />
                            </motion.span>
                          )}
                          <span style={{
                            color: '#191F28',
                            fontSize: '1.02rem',
                            fontWeight: isPicked || isTop ? 700 : 500,
                            letterSpacing: '-0.3px',
                            lineHeight: 1.4,
                          }}>
                            {opt.text}
                          </span>
                        </div>

                        {/* "내 선택" */}
                        <AnimatePresence>
                          {isPicked && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.6, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ type: 'spring', bounce: 0.5 }}
                              style={{
                                position: 'absolute', top: '-9px', left: '14px', zIndex: 2,
                                background: '#191F28', color: '#fff',
                                fontSize: '0.66rem', fontWeight: 800,
                                padding: '3px 9px', borderRadius: '100px', letterSpacing: '-0.2px',
                              }}
                            >
                              내 선택
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* "제일 많았어요" 배지 (1·2번) */}
                        <AnimatePresence>
                          {isTop && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.6, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ delay: 0.5 + idx * 0.15, type: 'spring', bounce: 0.5 }}
                              style={{
                                position: 'absolute', top: '-10px', right: '12px', zIndex: 3,
                                background: '#3182F6', color: '#FFFFFF',
                                fontSize: '0.66rem', fontWeight: 800,
                                padding: '3px 10px', borderRadius: '100px', letterSpacing: '-0.2px',
                                boxShadow: '0 4px 12px rgba(49,130,246,0.35)',
                              }}
                            >
                              제일 많았어요
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* 안내 / 결과 캡션 */}
                {!revealed ? (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    style={{ marginTop: '1.5rem', textAlign: 'center', color: '#ADB5BD', fontSize: '0.85rem', fontWeight: 600 }}
                  >
                    항목을 탭하면 결과가 나와요
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5, ease }}
                    style={{ marginTop: '1.6rem', textAlign: 'center', color: '#6B7684', fontSize: '0.92rem', fontWeight: 600, letterSpacing: '-0.2px', lineHeight: 1.5 }}
                  >
                    이 두 가지가 <span style={{ color: '#3182F6', fontWeight: 700 }}>제일 큰 걱정</span>이었어요
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ───────── 알아보기 화면 ───────── */}
            {view === 'explore' && (
              <motion.div
                key="explore"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'inline-block', background: '#EBF5FF', color: '#3182F6',
                    fontSize: '0.78rem', fontWeight: 800, padding: '0.35rem 0.9rem',
                    borderRadius: '100px', marginBottom: '0.9rem', letterSpacing: '-0.2px',
                  }}>
                    가장 큰 걱정 두 가지
                  </div>
                  <h2 style={{
                    color: '#191F28',
                    fontSize: 'clamp(1.35rem, 4.5vw, 1.65rem)',
                    fontWeight: 800, margin: '0 0 0.5rem', lineHeight: 1.35, letterSpacing: '-0.6px',
                  }}>
                    토스가 어떻게<br />해결하는지 볼까요?
                  </h2>
                  <p style={{ color: '#6B7684', fontSize: '0.9rem', margin: '0 0 1.5rem', letterSpacing: '-0.2px' }}>
                    궁금한 걱정을 눌러 직접 확인해보세요
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', gap: '0.85rem' }}>
                  {topOptions.map((opt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.12, duration: 0.5, ease }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        background: '#F7F8FA',
                        border: '1px solid #EEF0F3',
                        borderRadius: '18px',
                        padding: '1.25rem 1.3rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.85rem' }}>
                        <span style={{
                          background: '#3182F6', color: '#fff', fontSize: '0.66rem', fontWeight: 800,
                          padding: '2px 8px', borderRadius: '100px', whiteSpace: 'nowrap', flexShrink: 0,
                          marginTop: '0.15rem'
                        }}>
                          걱정 {i + 1}
                        </span>
                        <span style={{ 
                          color: '#191F28', fontWeight: 700, fontSize: '0.95rem', 
                          letterSpacing: '-0.3px', lineHeight: 1.4, wordBreak: 'keep-all' 
                        }}>
                          {opt.text}
                        </span>
                      </div>
                      <motion.button
                        className="worry-cta"
                        onClick={() => setModal(opt.modal ?? null)}
                        whileHover={{ scale: 1.02, backgroundColor: '#1B64DA' }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          width: '100%',
                          background: '#3182F6', color: '#FFFFFF', border: 'none',
                          borderRadius: '12px', padding: '0.85rem',
                          fontSize: '0.95rem', fontWeight: 800, cursor: 'pointer',
                          letterSpacing: '-0.2px', boxShadow: '0 8px 20px rgba(49,130,246,0.28)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                        }}
                      >
                        한번 알아볼까요?
                        <Chevron color="#fff" size={17} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                <button
                  onClick={resetVote}
                  style={{
                    width: '100%', marginTop: '1.1rem', background: 'transparent', border: 'none',
                    color: '#8B95A1', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                    padding: '0.5rem', letterSpacing: '-0.2px',
                  }}
                >
                  ↩ 다시 투표하기
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── 걱정 상세 페이지 (토스 화면 전환) ── */}
      <AnimatePresence>
        {modal && (
          <ModalContent modal={modal} setModal={setModal} />
        )}
      </AnimatePresence>
    </>
  );
}

function ModalContent({ modal, setModal }: { modal: 'security' | 'recognition', setModal: (val: any) => void }) {
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 마운트 후 ref가 연결된 다음 자식 컴포넌트들을 렌더링하도록 강제합니다.
    setIsMounted(true);
  }, []);

  // 모달(섹션)이 변경될 때마다 스크롤을 즉시 최상단으로 리셋
  useEffect(() => {
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTop = 0;
    }
  }, [modal]);

  return (
          <motion.div
            key="worry-page"
            ref={modalScrollRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
            style={{
              position: 'fixed', top: 0, left: 0,
              width: '100vw', height: '100vh',
              background: 'linear-gradient(135deg, #F0F7FF 0%, #F5F3FF 50%, #FFF0F6 100%)',
              backgroundAttachment: 'fixed',
              zIndex: 9999,
              overflowY: 'auto',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <div style={{
              position: 'sticky', top: 0, width: '100%',
              padding: '0.75rem 1rem', display: 'flex', alignItems: 'center',
              zIndex: 10000,
              background: 'linear-gradient(to bottom, rgba(245,243,255,0.9) 30%, rgba(245,243,255,0))',
            }}>
              <motion.button
                onClick={() => setModal(null)}
                whileTap={{ scale: 0.9 }}
                aria-label="뒤로가기"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E8EB',
                  borderRadius: '50%',
                  width: 44, height: 44, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                <BackArrow />
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease }}
              style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ paddingBottom: '4rem', width: '100%', maxWidth: '100vw', display: 'flex', justifyContent: 'center' }}>
                {isMounted && modal === 'security' && <SecurityConcernSection containerRef={modalScrollRef} />}
                {isMounted && modal === 'recognition' && <RecognitionConcernSection scrollContainerRef={modalScrollRef} />}
              </div>

              {/* ── 다른 걱정으로 전환 ── */}
              <div style={{ width: '100%', maxWidth: '480px', margin: '1.5rem auto 3rem', padding: '0 1.5rem' }}>
                <div style={{ height: 1, background: '#E5E8EB', marginBottom: '1.25rem' }} />
                <div style={{ color: '#8B95A1', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.7rem', textAlign: 'center', letterSpacing: '-0.2px' }}>
                  다른 걱정도 확인해보세요
                </div>
                <motion.button
                  onClick={() => setModal(modal === 'security' ? 'recognition' : 'security')}
                  whileHover={{ scale: 1.015, backgroundColor: '#F0F7FF' }}
                  whileTap={{ scale: 0.985 }}
                  style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1.5px solid #CFE4FF',
                    borderRadius: '16px',
                    padding: '1.15rem 1.3rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 6px 16px rgba(49,130,246,0.1)',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textAlign: 'left' }}>
                    <span style={{ background: '#3182F6', color: '#fff', fontSize: '0.66rem', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', flexShrink: 0 }}>
                      {modal === 'security' ? '걱정 2' : '걱정 1'}
                    </span>
                    <span style={{ color: '#191F28', fontWeight: 700, fontSize: '0.98rem', letterSpacing: '-0.3px' }}>
                      {modal === 'security' ? '인식이 잘 안되면 어쩌죠?' : '내 얼굴 데이터, 안전한가요?'}
                    </span>
                  </span>
                  <Chevron size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
  );
}
