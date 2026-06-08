import { motion } from 'framer-motion';

export default function IntroSubtitleSection() {
  return (
    <section className="intro-section">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, margin: '-100px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'relative' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: 'spring', bounce: 0.5 }}
          style={{
            background: '#F0F7FF',
            color: '#3182F6',
            fontWeight: 800,
            fontSize: '1.2rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '100px',
            marginBottom: '2rem',
            boxShadow: '0 8px 24px rgba(49,130,246,0.2)',
            zIndex: 10
          }}
        >
          써볼까 말까?? 🤔
        </motion.div>

        <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
          {/* 단말기 정면 사진 (부드러운 부유 애니메이션) */}
          <motion.img
            src="/terminal-front.png"
            alt="토스 페이스페이 결제 단말기"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 30px 55px rgba(49,130,246,0.18))',
            }}
          />
          
          {/* 단말기 화면 중앙에 위치할 토스 로고 */}
          <motion.img
            src="/toss-logo-transparent.png"
            alt="Toss Logo"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: '30%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100px',
              height: 'auto',
              opacity: 0.9,
              zIndex: 5
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
