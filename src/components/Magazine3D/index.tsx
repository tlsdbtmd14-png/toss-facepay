import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import BendingPage from './BendingPage';

export default function Magazine3D({
  coverRotate, page1Rotate, page2Rotate,
}: {
  coverRotate: MotionValue<number>;
  page1Rotate: MotionValue<number>;
  page2Rotate: MotionValue<number>;
}) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }} style={{ pointerEvents: 'auto' }}>
        <ambientLight intensity={1.2} />
        <directionalLight position={[2, 5, 2]} intensity={0.5} castShadow />
        <Environment preset="city" />

        <React.Suspense fallback={null}>
          <MagazinePages 
            coverRotate={coverRotate} page1Rotate={page1Rotate} page2Rotate={page2Rotate}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

import { useMotionValue } from 'framer-motion';

function MagazinePages({
  coverRotate, page1Rotate, page2Rotate
}: any) {
  const staticRotate = useMotionValue(0);
  // Load textures
  const [mag1, mag2, mag3, coverBg] = useTexture([
    '/mag-img1.jpg', '/mag-img2.jpg', '/mag-img3.jpg', '/cover-bg.jpg'
  ]);

  const textStyle: React.CSSProperties = {
    padding: '40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
    background: 'transparent', boxSizing: 'border-box'
  };
  const titleStyle: React.CSSProperties = { fontSize: '40px', fontWeight: 800, color: '#191F28', marginBottom: '30px', lineHeight: 1.3, margin: 0 };
  const pStyle: React.CSSProperties = { fontSize: '18px', color: '#4E5968', lineHeight: 1.6, margin: 0, marginTop: '20px' };

  return (
    // scale=1.3 makes the book larger. position-x needs to shift left to keep it centered.
    <group position={[-0.9, 0, 0]} scale={1.3}>
      {/* Static Page 3 */}
      <BendingPage 
        rotateY={staticRotate}
        zOffset={-0.01}
        frontContent={
          <div style={textStyle}>
            <h2 style={titleStyle}>아무것도 배울 필요 없는<br/>가장 쉬운 결제</h2>
            <p style={pStyle}>앱을 켜고, 메뉴를 찾고, 비밀번호를 누르는 복잡한 과정.<br/><br/>얼굴 결제는 그저 단말기를 '바라보는 것' 만으로 모든 과정을 생략합니다. 세상에서 가장 쉬운 결제, 바로 당신의 얼굴입니다.</p>
          </div>
        }
      />
      {/* Page 2 */}
      <BendingPage 
        rotateY={page2Rotate}
        zOffset={0.00}
        backTexture={mag3}
        frontContent={
          <div style={textStyle}>
            <h2 style={titleStyle}>두 손의<br/>완벽한 자유</h2>
            <p style={pStyle}>비 오는 날 우산을 들고 있을 때도, 커피와 짐을 양손 가득 들고 있을 때도.<br/><br/>지갑이나 스마트폰을 꺼내려 짐을 내려놓을 필요가 없습니다. 아무것도 만질 필요 없이, 그대로 결제하세요.</p>
          </div>
        }
      />
      {/* Page 1 */}
      <BendingPage 
        rotateY={page1Rotate}
        zOffset={0.01}
        backTexture={mag2}
        frontContent={
          <div style={textStyle}>
            <h2 style={titleStyle}>가장 자연스러운<br/>신분증</h2>
            <p style={pStyle}>지문이나 홍채를 보며 사람을 식별하는 사람은 없습니다. 우리가 누군가를 알아볼 때 가장 먼저 보는 것.<br/><br/>인간에게 가장 자연스러운 인식 방식을 기술로 완벽하게 구현했습니다.</p>
          </div>
        }
      />
      {/* Cover Page */}
      <BendingPage 
        rotateY={coverRotate}
        zOffset={0.02}
        backTexture={mag1}
        frontTexture={coverBg}
        frontContent={
          <div style={{ ...textStyle, background: 'transparent', color: '#F2F3F5', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: '100px', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-3px', textAlign: 'right', margin: 0 }}>
              THE<br/>FACE<br/>ISSUE
            </h2>
          </div>
        }
      />
    </group>
  );
}
