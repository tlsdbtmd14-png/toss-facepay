export default function UIOverlay() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}>
      
      {/* 섹션 1 */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw' }}>
         <div className="glass-card">
           <h1 className="text-5xl font-bold mb-6" style={{ fontWeight: 800, letterSpacing: '-1px' }}>
             예술과 공간의 조화
           </h1>
           <p className="text-xl leading-relaxed" style={{ fontWeight: 500, color: '#333' }}>
             압도적인 3D 유체 배경과 함께<br />
             당신의 시선을 사로잡는 몰입형 전시.
           </p>
         </div>
      </section>

      {/* 섹션 2 */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw' }}>
         <div className="glass-card">
           <h1 className="text-5xl font-bold mb-6" style={{ fontWeight: 800, letterSpacing: '-1px' }}>
             틀을 깨는 디자인
           </h1>
           <p className="text-xl leading-relaxed" style={{ fontWeight: 500, color: '#333' }}>
             평범한 2D 이미지가 거대한 3D 캔버스가 되어<br />
             새로운 시각적 경험을 제공합니다.
           </p>
         </div>
      </section>

      {/* 섹션 3 */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '10vw' }}>
         <div className="glass-card">
           <h1 className="text-5xl font-bold mb-6" style={{ fontWeight: 800, letterSpacing: '-1px' }}>
             무한한 갤러리
           </h1>
           <p className="text-xl leading-relaxed" style={{ fontWeight: 500, color: '#333' }}>
             가상 공간에 떠 있는 액자들을 통해<br />
             원하는 모든 작품을 입체적으로 감상하세요.
           </p>
         </div>
      </section>

    </div>
  );
}
