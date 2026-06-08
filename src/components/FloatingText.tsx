import { Html } from '@react-three/drei';

export default function FloatingText({ title, description, position, rotation }: { title: string, description: React.ReactNode, position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* transform 속성을 주면 HTML 요소가 3D 공간에 물리적으로 박히게 됩니다. */}
      {/* distanceFactor를 8에서 4.5로 줄여서 화면 내에서 차지하는 비율(크기)을 대폭 줄였습니다. */}
      <Html transform wrapperClass="html-3d-wrapper" distanceFactor={4.5}>
        <div className="glass-card" style={{ width: '360px', padding: '2rem', pointerEvents: 'none' }}>
          <h1 className="text-3xl font-bold mb-3" style={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
            {title}
          </h1>
          <p className="text-base leading-relaxed" style={{ fontWeight: 500, color: '#333' }}>
            {description}
          </p>
        </div>
      </Html>
    </group>
  );
}
