import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture, RoundedBox, Float, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

// ── 개별 글래스 카드 ────────────────────────────────────────────────
interface CardProps {
  position: [number, number, number];
  imgUrl: string;
  floatSpeed: number;
  floatIntensity: number;
  rotationIntensity: number;
  initRotY?: number;
}

const GlassCard = ({
  position,
  imgUrl,
  floatSpeed,
  floatIntensity,
  rotationIntensity,
  initRotY = 0,
}: CardProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(`/${imgUrl}`);
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame((state) => {
    if (!groupRef.current) return;
    // 마우스 패럴랙스 틸팅
    const px = (state.pointer.x * Math.PI) / 7;
    const py = (state.pointer.y * Math.PI) / 7;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      initRotY + px,
      0.045
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -py,
      0.045
    );
  });

  return (
    // 카드마다 독립적인 Float
    <Float
      speed={floatSpeed}
      floatIntensity={floatIntensity}
      rotationIntensity={rotationIntensity}
    >
      <group ref={groupRef} position={position}>
        {/* 유리 바디 */}
        <RoundedBox args={[1.75, 2.35, 0.09]} radius={0.18} smoothness={2} position={[0, 0, -0.05]}>
          <meshPhysicalMaterial
            transmission={0.88}
            roughness={0.06}
            ior={1.52}
            thickness={0.25}
            color="#c8e8ff"
            reflectivity={0.9}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* 얼굴 이미지 */}
        <mesh position={[0, 0.18, 0.02]}>
          <planeGeometry args={[1.42, 1.42]} />
          <meshBasicMaterial map={texture} transparent />
        </mesh>

        {/* 하단 frosted 영역 */}
        <mesh position={[0, -0.82, 0.025]}>
          <planeGeometry args={[1.42, 0.5]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} />
        </mesh>

        {/* 카드 테두리 하이라이트 */}
        <RoundedBox args={[1.79, 2.39, 0.015]} radius={0.18} smoothness={1} position={[0, 0, -0.1]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
        </RoundedBox>

        {/* 상단 작은 카메라 인식 표시 */}
        <mesh position={[0, 1.05, 0.06]}>
          <circleGeometry args={[0.06, 32]} />
          <meshBasicMaterial color="#3182f6" transparent opacity={0.9} />
        </mesh>
      </group>
    </Float>
  );
};

// ── 씬 전체 ─────────────────────────────────────────────────────────
const Scene = () => {
  const cards = [
    { id: 20, pos: [-4.2,  1.2, -3.5] as [number,number,number], speed: 1.2, fi: 0.8, ri: 0.3, ry: 0.2  },
    { id: 21, pos: [-2.0, -0.8,  0.5] as [number,number,number], speed: 1.8, fi: 1.2, ri: 0.5, ry: -0.1 },
    { id: 22, pos: [ 0.1,  1.6, -1.2] as [number,number,number], speed: 1.5, fi: 1.0, ri: 0.4, ry: 0.0  },
    { id: 23, pos: [ 2.4, -0.3,  1.5] as [number,number,number], speed: 2.0, fi: 0.9, ri: 0.3, ry: -0.2 },
    { id: 24, pos: [ 4.8,  1.3, -4.0] as [number,number,number], speed: 1.1, fi: 0.7, ri: 0.2, ry: 0.3  },
    { id: 25, pos: [-3.6, -2.2, -0.5] as [number,number,number], speed: 1.6, fi: 1.1, ri: 0.4, ry: 0.1  },
    { id: 26, pos: [ 1.2, -2.4, -2.0] as [number,number,number], speed: 1.3, fi: 0.85,ri: 0.35,ry: -0.15},
    { id: 27, pos: [ 3.8, -2.0,  0.8] as [number,number,number], speed: 1.9, fi: 1.0, ri: 0.45,ry: 0.2  },
  ];

  return (
    <>
      {/* 스튜디오 환경맵 → 유리에 반사/굴절 */}
      <Environment preset="studio" />

      {/* 라이팅 */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[8, 12, 10]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-8, -6, -5]} intensity={1.2} color="#a0c8ff" />
      <pointLight position={[0, 0, 6]} intensity={1.5} color="#3182f6" distance={20} />

      {/* 카드들 */}
      <Suspense fallback={null}>
        {cards.map((c) => (
          <GlassCard
            key={c.id}
            imgUrl={`image ${c.id}.png`}
            position={c.pos}
            floatSpeed={c.speed}
            floatIntensity={c.fi}
            rotationIntensity={c.ri}
            initRotY={c.ry}
          />
        ))}
      </Suspense>

      {/* 후처리 이펙트는 성능 향상을 위해 제거됨 */}
    </>
  );
};

// ── 메인 export ──────────────────────────────────────────────────────
export default function FloatingFaces3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.5], fov: 48 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}  // 성능을 위해 최대 해상도를 1.5로 제한
      style={{ width: '100%', height: '100%' }}
    >
      <Scene />
    </Canvas>
  );
}
