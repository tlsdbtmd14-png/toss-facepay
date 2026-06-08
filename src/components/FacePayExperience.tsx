import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoStream = ({ stream, className, onFrameCapture }: { stream: MediaStream | null, className?: string, onFrameCapture?: (url: string) => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      const video = videoRef.current;
      video.srcObject = stream;
      video.play().catch(console.error);
      
      if (onFrameCapture) {
        const handlePlaying = () => {
          setTimeout(() => {
            if (video.videoWidth > 0) {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                // Flip horizontally to match the mirrored CSS (transform: scaleX(-1))
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                onFrameCapture(canvas.toDataURL('image/jpeg', 0.8));
              }
            }
          }, 800); // 800ms 뒤에 찰칵!
        };
        video.addEventListener('playing', handlePlaying, { once: true });
      }
    }
  }, [stream, onFrameCapture]);
  
  return <video ref={videoRef} autoPlay playsInline muted className={className} />;
};

export default function FacePayExperience() {
  const [step, setStep] = useState<'idle' | 'scanning' | 'success' | 'fail'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setStream(null);
  };

  const startExperience = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setCapturedPhoto(null);
      setStep('scanning');
      // 기존 5초 자동 성공 로직 삭제 -> 유저가 클릭할 때까지 무한 대기!
    } catch (err) {
      console.error(err);
      alert("카메라 접근을 허용해 주셔야 가상 체험이 가능합니다.");
    }
  };

  const handleSelect = (type: 'live' | 'photo') => {
    stopCamera();
    if (type === 'live') {
      setStep('success');
    } else {
      setStep('fail');
    }
  };

  const resetExperience = () => {
    stopCamera();
    setStep('idle');
  };

  // onFrameCapture가 재생성되지 않도록 useCallback 사용
  const handleCapture = useCallback((url: string) => {
    setCapturedPhoto(url);
  }, []);

  return (
    <section id="face-pay-experience-section" className="face-pay-section">
      <motion.div
        className="device-frame-wrapper"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            display: 'inline-block',
            background: '#EBF5FF',
            border: 'none',
            borderRadius: '100px',
            padding: '0.35rem 1rem',
            color: '#3182F6',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
          }}>
            걱정이 해소됐다면 — 이제 직접 확인해보세요
          </div>
          <h2 className="face-pay-title" style={{ color: '#191F28', margin: 0 }}>직접 얼굴로 결제해보세요</h2>
        </div>

        {step === 'scanning' ? (
          <p className="instruction-text" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem', fontWeight: 700, color: '#3182F6', animation: 'pulse 2s infinite' }}>
            화면을 선택해서 결제하세요
          </p>
        ) : (
          <p className="instruction-text" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.1rem', color: '#6B7684' }}>
            사진으로는 결제되지 않습니다 — 직접 눈으로 확인해보세요 👀
          </p>
        )}
        
        <div className="showcase-flex-container">
          
          {/* 좌측 패널: 실시간 영상 */}
          <AnimatePresence>
            {step === 'scanning' && (
              <motion.div 
                className="side-panel left-panel clickable-panel"
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.4 }}
                onClick={() => handleSelect('live')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderColor: '#191F28' }}
              >
                <div className="panel-header" style={{ color: '#191F28' }}>화면 1</div>
                <div className="panel-video-wrapper">
                  <VideoStream stream={stream} className="face-pay-video" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 중앙 패널: 단말기 */}
          <div className="device-frame-container" style={{ zIndex: 10 }}>
            <img src="/terminal-device-cropped.png" alt="Terminal Device" className="device-frame-image" />
            <div className="device-screen-area">
              <AnimatePresence mode="wait">
                {step === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="face-pay-idle">
                    <div className="camera-icon-placeholder">📸</div>
                    <button className="start-btn" onClick={startExperience}>얼굴 스캔 시작</button>
                  </motion.div>
                )}
                
                {step === 'scanning' && (
                  <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="face-pay-scanner-container">
                    <VideoStream stream={stream} className="face-pay-video" onFrameCapture={handleCapture} />
                    <div className="scanner-border" />
                    <motion.div className="scanner-laser" animate={{ top: ['0%', '100%', '0%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div key="success" className="face-pay-success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="success-icon">✓</div>
                    <div className="receipt-text" style={{ textAlign: 'center' }}>
                      결제 완료!<br/>
                      <span style={{ fontSize: '1rem', color: '#3182f6', fontWeight: 600, display: 'block', marginTop: '0.5rem' }}>실제 인물 인증됨</span>
                    </div>
                    <button className="reset-btn" onClick={resetExperience} style={{ marginTop: '1.5rem' }}>다시 하기</button>
                  </motion.div>
                )}

                {step === 'fail' && (
                  <motion.div key="fail" className="face-pay-success fail-state" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className="success-icon" style={{ backgroundColor: '#e53e3e' }}>❌</div>
                    <div className="receipt-text" style={{ textAlign: 'center', color: '#e53e3e' }}>
                      결제 실패<br/>
                      <span style={{ fontSize: '1rem', color: '#6b7684', fontWeight: 'normal', display: 'block', marginTop: '0.5rem' }}>사진으로는 결제할 수 없습니다</span>
                    </div>
                    <button className="reset-btn" onClick={resetExperience} style={{ marginTop: '1.5rem', backgroundColor: '#e53e3e' }}>다시 하기</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 우측 패널: 정지된 사진 */}
          <AnimatePresence>
            {step === 'scanning' && (
              <motion.div 
                className="side-panel right-panel clickable-panel"
                initial={{ opacity: 0, x: -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.9 }}
                transition={{ type: "spring", bounce: 0.4 }}
                onClick={() => handleSelect('photo')}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderColor: '#191F28' }}
              >
                <div className="panel-header" style={{ color: '#191F28' }}>화면 2</div>
                <div className="panel-video-wrapper photo-wrapper" style={{ background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {capturedPhoto ? (
                    <img src={capturedPhoto} alt="Captured Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#8b95a1', fontSize: '0.9rem' }}>로딩 중...</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </motion.div>
    </section>
  );
}
