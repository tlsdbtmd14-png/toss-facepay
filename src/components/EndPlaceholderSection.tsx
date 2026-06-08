import { motion } from 'framer-motion';

// 부드러운 등장 프리셋
const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: '-60px' },
};

const ease = [0.16, 1, 0.3, 1] as const;

// 핵심 요약 3가지
const summary = [
  { value: '0.3초', label: '결제 완료까지', sub: '카드 꺼낼 새도 없이' },
  { value: '단방향 암호화', label: '얼굴 데이터 보호', sub: '유출돼도 복원 불가' },
  { value: '바라만 봐도', label: '인증 끝', sub: '아무것도 꺼내지 않고' },
];

export default function EndPlaceholderSection() {
  const handleTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleExperience = () => {
    document.getElementById('face-pay-experience-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      className="story-section"
      style={{
        minHeight: '100vh',
        justifyContent: 'center',
        padding: '12vh 1.5rem',
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* 라벨 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, ease }}
          style={{
            color: '#3182F6',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '-0.2px',
            marginBottom: '1.1rem',
          }}
        >
          이제 정리해볼게요
        </motion.div>

        {/* 메인 헤드라인 */}
        <motion.h2
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.05, ease }}
          style={{
            color: '#191F28',
            fontWeight: 800,
            fontSize: 'clamp(2.1rem, 6vw, 3.2rem)',
            lineHeight: 1.3,
            letterSpacing: '-1.5px',
            textAlign: 'center',
            margin: 0,
          }}
        >
          이제, 당신의 얼굴이<br />
          <span style={{ color: '#3182F6' }}>가장 빠른 결제 수단</span>입니다
        </motion.h2>

        {/* 서브 카피 */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.12, ease }}
          style={{
            color: '#6B7684',
            fontSize: 'clamp(1rem, 2.4vw, 1.15rem)',
            lineHeight: 1.65,
            textAlign: 'center',
            margin: '1.25rem 0 0',
            letterSpacing: '-0.3px',
          }}
        >
          지갑도, 카드도, 비밀번호도 필요 없어요.<br />
          그저 바라보는 것만으로 결제가 끝납니다.
        </motion.p>

        {/* 요약 카드 3개 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            margin: '3rem 0',
          }}
        >
          {summary.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease }}
              style={{
                background: '#F7F8FA',
                borderRadius: '20px',
                padding: '1.4rem 1.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ color: '#8B95A1', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem', letterSpacing: '-0.2px' }}>
                  {item.label}
                </div>
                <div style={{ color: '#191F28', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.1 }}>
                  {item.value}
                </div>
              </div>
              <div style={{ color: '#ADB5BD', fontSize: '0.86rem', fontWeight: 500, textAlign: 'right', letterSpacing: '-0.2px', flexShrink: 0 }}>
                {item.sub}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA 버튼 */}
        <motion.button
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          onClick={handleExperience}
          whileHover={{ scale: 1.02, backgroundColor: '#1B64DA' }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#3182F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            padding: '1.25rem',
            fontSize: '1.1rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '-0.3px',
            boxShadow: '0 10px 28px rgba(49,130,246,0.32)',
          }}
        >
          다시 한번 체험해보기
        </motion.button>

        {/* 보조 텍스트 버튼 */}
        <motion.button
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.58, ease }}
          onClick={handleTop}
          whileHover={{ color: '#3182F6' }}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8B95A1',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '1rem',
            marginTop: '0.5rem',
            letterSpacing: '-0.2px',
          }}
        >
          처음으로 돌아가기
        </motion.button>

        {/* 푸터 */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.66, ease }}
          style={{
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #EEF0F3',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#191F28', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
            toss<span style={{ color: '#3182F6' }}>face</span>
          </div>
          <div style={{ color: '#ADB5BD', fontSize: '0.8rem', marginTop: '0.5rem', letterSpacing: '-0.2px' }}>
            얼굴로 시작하는 가장 빠른 결제
          </div>
        </motion.div>

      </div>
    </section>
  );
}
