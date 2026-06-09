import { useRef, useEffect } from 'react';

export default function IntroTextSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const sec = sectionRef.current;
    const v = videoRef.current;
    if (!sec || !v) return;

    let engaged = false;
    let advanced = false;
    let snapping = false;
    let fallback: ReturnType<typeof setTimeout> | null = null;

    const goNext = () => {
      if (advanced) return;
      advanced = true;
      if (fallback) { clearTimeout(fallback); fallback = null; }
      const sections = Array.from(document.querySelectorAll('section'));
      const idx = sections.indexOf(sec);
      const next = sections[idx + 1];
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const onEnded = () => goNext();
    v.addEventListener('ended', onEnded);

    const engage = () => {
      if (engaged) return;
      engaged = true;
      advanced = false;
      snapping = true;
      // 풀스크린 스냅
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // 스냅 후 재생 시작
      setTimeout(() => {
        v.currentTime = 0;
        v.play().catch(() => {});
        snapping = false;
        // ended 이벤트가 안 올 경우 대비한 폴백 타이머
        const durMs = ((v.duration && isFinite(v.duration)) ? v.duration : 10) * 1000;
        if (fallback) clearTimeout(fallback);
        fallback = setTimeout(goNext, durMs + 900);
      }, 520);
    };

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) v.style.opacity = '1';

        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          engage();
        }
        // 충분히 벗어나면 리셋 (다시 들어오면 재생)
        if (e.intersectionRatio < 0.15 && !snapping) {
          engaged = false;
          advanced = false;
          v.pause();
          if (fallback) { clearTimeout(fallback); fallback = null; }
        }
      },
      { threshold: [0, 0.15, 0.6, 1] }
    );
    io.observe(sec);

    return () => {
      io.disconnect();
      v.removeEventListener('ended', onEnded);
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-bgcolor="#FFFFFF"
      style={{
        position: 'relative',
        height: '100vh',
        margin: 0,
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent', // 투명 배경
      }}
    >
      {/* 이미지에서 영감을 받은 타이틀 영역 */}
      <div style={{ textAlign: 'center', marginBottom: '4rem', zIndex: 10 }}>
        <div style={{ 
          display: 'inline-block', 
          background: '#A1E2FF', // 토스 머니북 스타일 하늘색 하이라이트
          padding: '0.2rem 0.5rem', 
          fontWeight: 900, 
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', 
          letterSpacing: '1px',
          color: '#191F28'
        }}>
          TOSS FACEPAY
        </div>
        <h2 style={{ 
          fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
          fontWeight: 900, 
          marginTop: '1rem', 
          letterSpacing: '-2px',
          color: '#191F28',
          wordBreak: 'keep-all'
        }}>
          지갑 없는 생활, 어디까지 해보셨나요?
        </h2>
      </div>

      {/* 둥근 비디오 컨테이너 */}
      <div style={{
        position: 'relative',
        width: '90vw',
        maxWidth: '1200px',
        height: '65vh',
        minHeight: '500px',
        borderRadius: '30px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backgroundColor: '#f2f4f6'
      }}>
        <video
          ref={videoRef}
          src="/toss-video.mp4"
          muted
          playsInline
          preload="auto"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.52)', // 상·하단 레터박스(각 16.7%) 크롭 유지
            transformOrigin: 'center center',
            opacity: 0,
            transition: 'opacity 0.9s ease',
          }}
        />
      </div>
    </section>
  );
}
