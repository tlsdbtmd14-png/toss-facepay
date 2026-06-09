import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef } from 'react';

// 개별 영수증 컴포넌트 (React Hook Rule을 지키기 위해 분리)
function ReceiptCard({ review, idx, scrollYProgress }: { review: any, idx: number, scrollYProgress: MotionValue<number> }) {
  // 각 리뷰마다 스크롤 등장 타이밍 계산 (0.1부터 시작해서 0.1 간격으로 등장)
  const appearStart = 0.1 + (idx * 0.1);
  // 애니메이션 지속 길이는 0.2로 설정 (마지막 영수증이 0.7에 등장을 마치고 나면, 0.7~1.0 구간 동안 편안하게 읽을 수 있습니다)
  const appearEnd = appearStart + 0.2;
  
  // y: 위에서부터 제자리로 뚝 떨어지는 느낌
  // 스크롤이 끝점(appearEnd)을 지나 1.0(끝)에 도달할 때까지 무조건 투명도 1, 위치 0을 유지하도록 4구간으로 쪼개서 고정합니다. (투명해지는 버그 방지)
  const cardY = useTransform(scrollYProgress, [0, appearStart, appearEnd, 1], [-100, -100, 0, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, appearStart, appearEnd, 1], [0, 0, 1, 1]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} // 스크롤 전 초기 렌더링 시 절대 안 보이게 보장
      style={{
        position: 'absolute',
        top: review.top,
        left: review.left,
        zIndex: review.zIndex,
        background: '#FFFFFF',
        color: '#191F28',
        padding: '1.5rem 1.2rem',
        width: '240px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 2px 10px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid rgba(0,0,0,0.05)',
        transformOrigin: 'center center',
        // 스크롤과 연동된 값들 적용
        y: cardY,
        opacity: cardOpacity,
        rotate: review.rotate
      }}
    >
      {/* 영수증 상단 헤더 */}
      <div style={{ textAlign: 'center', borderBottom: '2px dashed #D1D6DB', paddingBottom: '0.8rem', marginBottom: '0.8rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#8B95A1', letterSpacing: '1px' }}>
          RECEIPT #00{idx + 1}
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: '#B0B8C1', marginTop: '2px' }}>
          TOSS FACE PAY
        </div>
      </div>

      {/* 영수증 메인 컨텐츠 (리뷰 제목) */}
      <div style={{
        fontSize: '1.3rem',
        fontWeight: 900,
        lineHeight: 1.3,
        letterSpacing: '-1px',
        textAlign: 'center',
        marginBottom: '0.8rem',
        wordBreak: 'keep-all'
      }}>
        "{review.keyword}"
      </div>

      {/* 영수증 세부 내역 (리뷰 본문) */}
      <div style={{ borderTop: '1px dashed #D1D6DB', borderBottom: '1px dashed #D1D6DB', padding: '1rem 0', marginBottom: '0.8rem' }}>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 500,
          lineHeight: 1.5,
          color: '#4E5968',
          wordBreak: 'keep-all',
          textAlign: 'center'
        }}>
          {review.text}
        </div>
      </div>

      {/* 영수증 하단 메타데이터 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.7rem', color: '#8B95A1', marginBottom: '1rem' }}>
        <span>AUTHOR</span>
        <span style={{ fontWeight: 600, color: '#191F28' }}>{review.author}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace', fontSize: '0.7rem', color: '#8B95A1', marginBottom: '1rem' }}>
        <span>DATE</span>
        <span style={{ fontWeight: 600, color: '#191F28' }}>{review.date}</span>
      </div>

      {/* 바코드 데코레이션 */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 'auto', opacity: 0.8 }}>
        <svg width="140" height="30" viewBox="0 0 100 40" preserveAspectRatio="none">
          <rect x="0" y="0" width="2" height="40" fill="#111" />
          <rect x="4" y="0" width="4" height="40" fill="#111" />
          <rect x="10" y="0" width="2" height="40" fill="#111" />
          <rect x="14" y="0" width="6" height="40" fill="#111" />
          <rect x="22" y="0" width="2" height="40" fill="#111" />
          <rect x="26" y="0" width="8" height="40" fill="#111" />
          <rect x="36" y="0" width="2" height="40" fill="#111" />
          <rect x="40" y="0" width="6" height="40" fill="#111" />
          <rect x="48" y="0" width="2" height="40" fill="#111" />
          <rect x="52" y="0" width="10" height="40" fill="#111" />
          <rect x="64" y="0" width="2" height="40" fill="#111" />
          <rect x="68" y="0" width="6" height="40" fill="#111" />
          <rect x="76" y="0" width="2" height="40" fill="#111" />
          <rect x="80" y="0" width="8" height="40" fill="#111" />
          <rect x="90" y="0" width="4" height="40" fill="#111" />
          <rect x="96" y="0" width="4" height="40" fill="#111" />
        </svg>
        <div style={{ fontSize: '0.65rem', fontFamily: 'monospace', marginTop: '4px', letterSpacing: '2px' }}>
          {Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // 뒷 배경 블러 및 어두워지는 효과 (0% ~ 15% 구간에서 진행)
  const backdropOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  const reviews = [
    { 
      keyword: "지갑 안 꺼내도", 
      text: "돼서 너무 편해요! 출근길 커피 살 때 최고👍", 
      author: "***",
      date: "2023.10.12",
      top: '10%', left: '15%', rotate: -8, zIndex: 2,
    },
    { 
      keyword: "사진 대면 차단", 
      text: "가짜 얼굴은 바로 막아버리더라고요. 완전 안심입니다.", 
      author: "***",
      date: "2023.11.05",
      top: '15%', left: '38%', rotate: 5, zIndex: 1,
    },
    { 
      keyword: "인식 속도 미침", 
      text: "단말기를 쳐다보기만 했는데 벌써 결제 완료 알림이 오네요.", 
      author: "***",
      date: "2024.01.20",
      top: '12%', left: '65%', rotate: 12, zIndex: 3,
    },
    { 
      keyword: "양손 가득 짐 들 때", 
      text: "지갑 찾을 필요 없이 얼굴만 비추면 되니까 진짜 유용해요.", 
      author: "***",
      date: "2024.03.15",
      top: '45%', left: '20%', rotate: -5, zIndex: 4,
    },
    { 
      keyword: "데이터 완벽 암호화", 
      text: "얼굴 데이터가 안전하게 보호된다고 해서 믿고 쓰고 있어요.", 
      author: "***",
      date: "2024.05.02",
      top: '50%', left: '48%', rotate: 6, zIndex: 5,
    }
  ];

  return (
    <section data-bgcolor="#FFF0F6" style={{ background: 'transparent', paddingBottom: '20vh', width: '100%' }}>
      
      {/* 1. 타이틀 (일반 스크롤, 100vh로 꽉 채워서 영수증 섹션과 완전히 분리) */}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', zIndex: 10, position: 'relative' }}>
        <h2 style={{
          fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 900,
          color: '#191F28', lineHeight: 1.2, letterSpacing: '-2px',
        }}>
          이미 수많은 사람들이<br />
          경험하고 있습니다
        </h2>
      </div>

      {/* 2. 스크롤 텔링 컨테이너 (마지막 영수증을 충분히 읽을 수 있도록 총 600vh로 늘림) */}
      <div ref={containerRef} style={{ height: '600vh', position: 'relative', width: '100%' }}>
        
        {/* Sticky 화면 (유저가 600vh를 스크롤하는 동안 화면에 고정) */}
        <div style={{ 
          position: 'sticky', 
          top: 0, 
          height: '100vh', 
          width: '100%', 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
          {/* 블러/어두워지는 백드롭 오버레이 */}
          <motion.div 
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(249, 250, 251, 0.7)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              opacity: backdropOpacity,
              zIndex: 1
            }}
          />

          {/* 영수증들이 나타날 공간 (블러 오버레이 위) */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1200px', height: '800px', zIndex: 2 }}>
            {reviews.map((review, idx) => (
              <ReceiptCard key={idx} review={review} idx={idx} scrollYProgress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
