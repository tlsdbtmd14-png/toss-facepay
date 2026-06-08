import { useMemo } from 'react';
import * as THREE from 'three';
import { Instances, Instance } from '@react-three/drei';

export default function SpiralStairs() {
  const stepsCount = 200; // 계단 개수를 늘려 더 깊은 공간감 형성
  const innerRadius = 5; // 나선 계단 중앙의 뚫려있는 공간(눈)의 반지름
  const stepWidth = 10; // 계단의 가로 길이 (폭)
  const midRadius = innerRadius + stepWidth / 2; 
  const heightStep = 0.5; // 계단 간의 높이 차이
  const angleStep = Math.PI / 16; // 계단 간 회전 각도
  
  const startAngle = -Math.PI / 2;

  // 부드러운 곡선의 난간(Handrail)을 만들기 위한 3D 좌표 계산
  const { stairs, innerPoints, outerPoints } = useMemo(() => {
    const s = [];
    const inPts = [];
    const outPts = [];

    for (let i = 0; i < stepsCount; i++) {
      const angle = startAngle + i * angleStep;
      const y = -2 - i * heightStep;
      
      const x = Math.cos(angle) * midRadius;
      const z = Math.sin(angle) * midRadius;
      
      const innerX = Math.cos(angle) * innerRadius;
      const innerZ = Math.sin(angle) * innerRadius;
      
      const outerX = Math.cos(angle) * (innerRadius + stepWidth * 0.95);
      const outerZ = Math.sin(angle) * (innerRadius + stepWidth * 0.95);

      s.push({
        position: [x, y, z] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
        innerPos: [innerX, y + 1, innerZ] as [number, number, number], // 난간 기둥 높이 조절
        outerPos: [outerX, y + 1, outerZ] as [number, number, number]
      });

      inPts.push(new THREE.Vector3(innerX, y + 2.2, innerZ));
      outPts.push(new THREE.Vector3(outerX, y + 2.2, outerZ));
    }
    return { stairs: s, innerPoints: inPts, outerPoints: outPts };
  }, []);

  const innerCurve = useMemo(() => new THREE.CatmullRomCurve3(innerPoints), [innerPoints]);
  const outerCurve = useMemo(() => new THREE.CatmullRomCurve3(outerPoints), [outerPoints]);

  return (
    <group>
      {/* 1. 고급스러운 대리석/세라믹 느낌의 계단 발판 */}
      <Instances limit={stepsCount}>
        <boxGeometry args={[stepWidth, 0.4, 2.8]} />
        <meshPhysicalMaterial 
          color="#f8f9fa" 
          roughness={0.15} 
          metalness={0.1} 
          clearcoat={1.0} 
          clearcoatRoughness={0.1} 
        />
        {stairs.map((stair, i) => (
          <Instance key={`step-${i}`} position={stair.position} rotation={stair.rotation} />
        ))}
      </Instances>

      {/* 2. 난간 기둥 (Balusters) - 메탈 소재 */}
      <Instances limit={stepsCount * 2}>
        <cylinderGeometry args={[0.08, 0.08, 2.2, 12]} />
        <meshPhysicalMaterial 
          color="#dcdcdc" 
          roughness={0.3} 
          metalness={0.8} 
          clearcoat={0.5} 
        />
        {stairs.map((stair, i) => (
          <group key={`pole-${i}`}>
            <Instance position={stair.innerPos} />
            <Instance position={stair.outerPos} />
          </group>
        ))}
      </Instances>

      {/* 3. 부드럽게 이어지는 곡선형 난간 손잡이 (Handrails) */}
      <mesh>
        <tubeGeometry args={[innerCurve, stepsCount * 3, 0.2, 16, false]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.6} clearcoat={1.0} />
      </mesh>
      
      <mesh>
        <tubeGeometry args={[outerCurve, stepsCount * 3, 0.25, 16, false]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.2} metalness={0.6} clearcoat={1.0} />
      </mesh>
    </group>
  );
}
