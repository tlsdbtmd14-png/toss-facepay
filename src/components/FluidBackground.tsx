import { Suspense } from 'react';
import { useTexture, useAspect } from '@react-three/drei';
import * as THREE from 'three';

function SimpleBackgroundInner() {
  // 텍스처 로드 (bg1.png)
  const texture = useTexture('/bg1.png');
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // 원본 이미지 해상도(일반적으로 1920x1080 기준)에 맞춰 화면을 덮는 스케일 계산
  // useAspect는 화면 비율에 맞춰 이미지가 찌그러지지 않게 cover 해주는 완벽한 비율을 반환합니다.
  const scale = useAspect(1920, 1080, 1);
  
  // 카메라(Z=5)에서 배경(Z=-50)까지의 거리 비례(55 / 5 = 11배)를 곱해줍니다.
  const zScale = 11;

  return (
    // 완벽한 2D 배경화면 (조명, 왜곡 없음)
    <mesh position={[0, 0, -50]} scale={[scale[0] * zScale, scale[1] * zScale, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function FluidBackground() {
  return (
    <Suspense fallback={null}>
      <SimpleBackgroundInner />
    </Suspense>
  );
}
