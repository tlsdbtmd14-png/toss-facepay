import { useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';

export default function GeometricPillars() {
  const count = 500; // 500개의 기하학적 기둥
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;
    
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < count; i++) {
      // 1. 높이(Y축) 분산: 카메라가 내려가는 궤도(-140 ~ +60)를 커버하도록 넓게 배치
      const y = Math.random() * 200 - 140; 
      
      // 2. 원형(Angle) 및 거리(Radius) 분산
      const angle = Math.random() * Math.PI * 2;
      
      // 레이어를 2개로 나누어, 일부는 가까이 스쳐 지나가고 일부는 멀리 배경으로 보이게 함
      // 가까운 궤도(15~22m), 먼 궤도(30~45m)
      const radius = Math.random() > 0.5 
        ? (15 + Math.random() * 7) 
        : (30 + Math.random() * 15);
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      dummy.position.set(x, y, z);
      
      // 3. 기둥의 크기(Scale): IT 미니멀리즘에 맞게 각진 직육면체. 높이가 매우 긴 주상절리 형태.
      const sizeX = 0.5 + Math.random() * 2.5;
      const sizeZ = 0.5 + Math.random() * 2.5;
      const height = 20 + Math.random() * 60; // 20m ~ 80m 거대한 높이
      
      dummy.scale.set(sizeX, height, sizeZ);
      
      // 4. 무작위 Y축 회전으로 단조로움 탈피
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      {/* 미니멀한 육면체 기하학 디자인 */}
      <boxGeometry args={[1, 1, 1]} />
      {/* 
        토스 블루 배경과 완벽하게 대비되는 '깨끗한 무광 화이트' 재질.
        은은하게 푸른빛(emissive)을 뿜어내어 공간에 녹아들게 함.
      */}
      <meshStandardMaterial 
        color="#ffffff" 
        roughness={0.3}     // 살짝 매끄러운 플라스틱 질감
        metalness={0.1}
        emissive="#0044ff"  // 어두운 곳에서도 살짝 푸른빛을 발산
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}
