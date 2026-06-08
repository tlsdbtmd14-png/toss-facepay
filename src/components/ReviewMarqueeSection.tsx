import { motion } from 'framer-motion';

export default function ReviewMarqueeSection() {
  const reviews = [
    { 
      keyword: "지갑 안\n꺼내도", 
      text: "돼서 너무 편해요! 출근길 커피 살 때 최고👍", 
      author: "김*혁" 
    },
    { 
      keyword: "사진 대면\n완전 차단", 
      text: "처음엔 내 사진으로 결제될까 걱정했는데, 가짜 얼굴은 바로 막아버리더라고요. 완전 안심입니다.", 
      author: "이*진" 
    },
    { 
      keyword: "인식 속도\n미쳤어요", 
      text: "단말기를 쳐다보기만 했는데 벌써 결제 완료 알림이 오네요.", 
      author: "박*현" 
    },
    { 
      keyword: "양손 가득\n짐 들 때", 
      text: "지갑 찾을 필요 없이 얼굴만 비추면 되니까 진짜 유용해요.", 
      author: "최*민" 
    },
    { 
      keyword: "데이터\n암호화", 
      text: "소중한 얼굴 데이터가 안전하게 보호된다고 해서 믿고 쓰고 있어요.", 
      author: "정*우" 
    }
  ];

  return (
    <section style={{ marginTop: '50vh', paddingTop: '20vh', paddingBottom: '15vh', paddingLeft: '10vw', paddingRight: '10vw', background: 'transparent', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. 타이틀 */}
      <div style={{ marginBottom: '8rem', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900,
          color: '#191F28', lineHeight: 1.3, letterSpacing: '-1.5px',
        }}>
          이미 수많은 사람들이<br />
          경험하고 있습니다
        </h2>
      </div>

      {/* 2. 단말기 래퍼 (외부 파츠 포함) */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '1100px', margin: '0 auto', zIndex: 1 }}>
        
        {/* 오른쪽 마그네틱 카드 긁는 부분 (MSR) */}
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '-28px', // 단말기 밖으로 튀어나오게
          width: '56px',
          height: '60%',
          background: '#FFFFFF',
          borderTopRightRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '12px 16px 0px #E5E8EB, 20px 20px 40px rgba(0,0,0,0.08)', // 물리적 두께(우하단) 추가
          zIndex: 0, // 단말기 본체 뒤로 들어가게
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '12px'
        }}>
          {/* 카드 긁는 홈 */}
          <div style={{ width: '8px', height: '90%', background: '#E5E8EB', borderRadius: '8px', boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.1)' }} />
        </div>

        {/* 단말기 본체 (베젤 역할) */}
        <div style={{
          position: 'relative',
          width: '100%',
          background: '#FFFFFF',
          borderRadius: '64px',
          boxShadow: '0 16px 0px #D1D6DB, 0 40px 80px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(0,0,0,0.05)', // 16px의 물리적 두께(하단) 추가
          padding: '24px 24px 120px 24px', // 얇은 상단/측면 베젤, 두꺼운 하단 베젤
          zIndex: 1 // MSR 덮도록
        }}>

          {/* 화면 안쪽 (스크린 영역) */}
          <div style={{
            position: 'relative',
            width: '100%',
            background: '#F9FAFB',
            borderRadius: '40px',
            overflow: 'hidden',
            padding: '8rem 3rem 6rem',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)'
          }}>
            {/* 상단 카메라 노치 (화면 안쪽 상단에 매달린 형태) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '280px',
              height: '32px',
              background: '#000000',
              borderBottomLeftRadius: '24px',
              borderBottomRightRadius: '24px',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', width: '100%' }}>
        {reviews.map((review, idx) => {
          const isLeft = idx % 2 === 0;
          return (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex', 
                flexDirection: isLeft ? 'row' : 'row-reverse',
                gap: '1.5rem',
                alignItems: 'flex-start',
                width: '100%'
              }}
            >
              {/* 프로필 이미지 */}
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                overflow: 'hidden',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                marginTop: '10px'
              }}>
                <img 
                  src={`/avatar_${idx + 1}.jpg`} 
                  alt="profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              {/* 투명한 말풍선 영역 (Glassmorphism) */}
              <div style={{
                position: 'relative',
                background: 'rgba(235, 238, 242, 0.65)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '30px',
                padding: '2.5rem 3rem',
                // 꼬리가 있는 방향에는 그림자가 지지 않도록 반대 방향으로 그림자를 완전히 뺌
                boxShadow: isLeft ? '25px 25px 40px rgba(31, 38, 135, 0.05)' : '-25px 25px 40px rgba(31, 38, 135, 0.05)',
                maxWidth: '80%'
              }}>
                {/* 뾰족한 말풍선 꼬리 (겹침 현상 없이 자연스럽게) */}
                <div style={{
                  position: 'absolute',
                  top: '25px',
                  // 반투명한 요소끼리 겹치면 색이 두 배로 진해져서 선이 생기므로, 겹치지 않게 정확히 -16px 에 위치시킴
                  [isLeft ? 'left' : 'right']: '-16px',
                  width: '16px',
                  height: '24px',
                  background: 'rgba(235, 238, 242, 0.65)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  clipPath: isLeft ? 'polygon(100% 0%, 0% 50%, 100% 100%)' : 'polygon(0% 0%, 100% 50%, 0% 100%)',
                  zIndex: 1,
                }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: isLeft ? 'left' : 'right' }}>
                  {/* 강조되는 거대한 키워드 (크기 확대) */}
                  <div style={{
                    fontSize: 'clamp(3.5rem, 7vw, 5.5rem)',
                    fontWeight: 900,
                    color: '#3182F6',
                    lineHeight: 1.15,
                    letterSpacing: '-2.5px',
                    whiteSpace: 'pre-line',
                    textShadow: '0 10px 30px rgba(49,130,246,0.15)'
                  }}>
                    {review.keyword}
                  </div>
                  
                  {/* 부가 설명 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                      color: '#4E5968',
                      lineHeight: 1.6,
                      fontWeight: 600,
                      wordBreak: 'keep-all'
                    }}>
                      {review.text}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
            </div>
          </div>

          {/* 하단 베젤의 IC 카드 슬롯 (이미지 그대로 재현) */}
          <div style={{
            position: 'absolute',
            bottom: '40px', // 하단 베젤의 가운데 쯤
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '36px',
            background: '#F0F2F5', // 움푹 파인 밝은 회색
            borderRadius: '36px', // 타원형 알약 모양
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(255,255,255,1)', // 안쪽 그림자 + 바깥 빛 반사
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}>
            {/* 진짜 카드가 들어가는 까만 틈새 */}
            <div style={{ 
              width: '260px', 
              height: '6px', 
              background: '#000000', 
              borderRadius: '3px', 
            }} />
          </div>

        </div>
      </div>
    </section>
  );
}
