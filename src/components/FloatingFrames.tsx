import { useTexture } from '@react-three/drei';


export function Frame({ url, width, height }: { url: string, width: number, height: number }) {
  const texture = useTexture(url);
  
  return (
    <group>
      {/* 액자 프레임 (유리 질감 느낌의 하얀 테두리) */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.3, height + 0.3, 0.1]} />
        <meshPhysicalMaterial 
          color="#ffffff" 
          roughness={0.2} 
          metalness={0.1} 
          clearcoat={1.0}
          transmission={0.5}
        />
      </mesh>
      {/* 실제 이미지 */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        {/* 이미지가 선명하게 보이도록 BasicMaterial 사용 */}
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}
