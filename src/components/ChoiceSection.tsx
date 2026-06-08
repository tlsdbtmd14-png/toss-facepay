import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SecurityConcernSection from './SecurityConcernSection';
import RecognitionConcernSection from './RecognitionConcernSection';

// 토스 스타일 chevron
const Chevron = ({ color = '#8B95A1' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <path d="M9 6L15 12L9 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ChoiceSection() {
  const [selectedWorry, setSelectedWorry] = useState<'none' | 'security' | 'recognition'>('none');

  const isModalOpen = selectedWorry === 'security' || selectedWorry === 'recognition';

  const toggleWorry = (worry: 'security' | 'recognition') => {
    setSelectedWorry(prev => prev === worry ? 'none' : worry);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <section id="choice-section" className="story-section" style={{ minHeight: '80vh', justifyContent: 'flex-start', paddingTop: '15vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: '#EBF5FF',
            border: 'none',
            borderRadius: '100px',
            padding: '0.4rem 1.1rem',
            color: '#3182F6',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.1rem',
          }}>
            방금 장면을 보고 이런 생각 드셨나요? 💭
          </div>
          <h2 className="scene-title" style={{ color: '#191F28', margin: 0 }}>
            솔직히, 이런 걱정<br />드시지 않았나요?
          </h2>
        </motion.div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '90%', maxWidth: '420px', zIndex: 10 }}>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => toggleWorry('security')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#FFFFFF',
              color: '#191F28',
              padding: '1.35rem 1.75rem',
              borderRadius: '20px',
              fontWeight: 700,
              border: '1px solid #E5E8EB',
              cursor: 'pointer',
              fontSize: '1.08rem',
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              textAlign: 'left',
            }}
          >
            <span>내 얼굴 데이터 유출 우려</span>
            <Chevron />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => toggleWorry('recognition')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: '#FFFFFF',
              color: '#191F28',
              padding: '1.35rem 1.75rem',
              borderRadius: '20px',
              fontWeight: 700,
              border: '1px solid #E5E8EB',
              cursor: 'pointer',
              fontSize: '1.08rem',
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              textAlign: 'left',
            }}
          >
            <span>근데 왜 하필 '얼굴' 인가요?</span>
            <Chevron />
          </motion.button>
        </div>
      </section>

      {/* ── 풀스크린 공간이동 모달 ── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* 레이어 1: 뒤 배경이 멀어지는 느낌 (어두워지며 블러) */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                zIndex: 9998,
              }}
              onClick={() => setSelectedWorry('none')}
            />

            {/* 레이어 2: 새 공간이 앞으로 다가오는 모달 */}
            <motion.div 
              key="modal"
              initial={{ opacity: 0, scale: 0.85, y: 60, borderRadius: '32px' }}
              animate={{ opacity: 1, scale: 1, y: 0, borderRadius: '0px' }}
              exit={{ opacity: 0, scale: 0.85, y: 60, borderRadius: '32px' }}
              transition={{ 
                duration: 0.55, 
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: '#0064FF',
                zIndex: 9999,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transformOrigin: 'center center',
              }}
            >
              {/* 닫기 버튼 */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                style={{
                  position: 'sticky',
                  top: 0,
                  left: 0,
                  width: '100%',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  zIndex: 10000,
                  background: 'linear-gradient(to bottom, #0064FF 60%, rgba(0,100,255,0) 100%)'
                }}
              >
                <motion.button
                  onClick={() => setSelectedWorry('none')}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.25)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: '50px',
                    padding: '0.8rem 1.5rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>←</span>
                  원래 화면으로
                </motion.button>
              </motion.div>

              {/* 콘텐츠 (안의 내용도 살짝 딜레이로 등장) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
              >
                {selectedWorry === 'security' && <SecurityConcernSection />}
                {selectedWorry === 'recognition' && <RecognitionConcernSection />}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
