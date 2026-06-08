import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useTransform, MotionValue } from 'framer-motion';
import { Html } from '@react-three/drei';

export default function BendingPage({
  rotateY,
  zOffset,
  frontContent,
  backContent,
  frontTexture,
  backTexture,
  width = 1.4,
  height = 1.8,
  thickness = 0.005
}: {
  rotateY: MotionValue<number>;
  zOffset: MotionValue<number> | number;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
  frontTexture?: THREE.Texture | null;
  backTexture?: THREE.Texture | null;
  width?: number;
  height?: number;
  thickness?: number;
}) {
  const geometryRef = useRef<THREE.BoxGeometry>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  // bendAmount maps rotateY (0 to -180) to a curve offset.
  const bendAmount = useTransform(rotateY, [0, -90, -180], [0, -0.15, 0]); 

  // Create materials array [right, left, top, bottom, front, back]
  const materials = useMemo(() => {
    const edgeMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0' });
    const frontMat = new THREE.MeshStandardMaterial({ 
      color: frontTexture ? 'white' : '#ffffff', 
      map: frontTexture || null,
      roughness: 1,
      metalness: 0
    });
    const backMat = new THREE.MeshStandardMaterial({ 
      color: backTexture ? 'white' : '#f9fafb', 
      map: backTexture || null,
      roughness: 1,
      metalness: 0
    });
    return [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat];
  }, [frontTexture, backTexture]);

  const initialPositions = useMemo(() => {
    // Only the X-axis needs segments (32) for curling. Y and Z can be 1 to save massive CPU cycles.
    const geo = new THREE.BoxGeometry(width, height, thickness, 32, 1, 1);
    geo.translate(width / 2, 0, 0);
    return geo.attributes.position.clone();
  }, [width, height, thickness]);

  useEffect(() => {
    if (geometryRef.current) {
      geometryRef.current.translate(width / 2, 0, 0);
    }
  }, [width]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotateY.get() * Math.PI / 180;
    }

    if (!geometryRef.current) return;
    const pos = geometryRef.current.attributes.position;
    const bend = bendAmount.get();
    
    for (let i = 0; i < pos.count; i++) {
      const x = initialPositions.getX(i);
      const y = initialPositions.getY(i);
      const origZ = initialPositions.getZ(i);
      
      const normalizedX = x / width;
      // Parabolic bend: max at center (normalizedX=0.5)
      const zOffset = 4.0 * normalizedX * (1.0 - normalizedX) * bend;
      
      pos.setXYZ(i, x, y, origZ + zOffset);
    }
    pos.needsUpdate = true;
    geometryRef.current.computeVertexNormals();
  });

  return (
    <group ref={groupRef} position-z={zOffset}>
      <mesh castShadow receiveShadow material={materials}>
        <boxGeometry ref={geometryRef} args={[width, height, thickness, 32, 1, 1]} />
      </mesh>

      {/* HTML Overlays for Text Content */}
      {frontContent && (
        <Html 
          transform 
          position={[width / 2, 0, thickness / 2 + 0.01]} 
          style={{ width: `500px`, height: `${500 * (height / width)}px`, opacity: 1 }}
          scale={width / 500}
        >
          {frontContent}
        </Html>
      )}
      {backContent && (
        <Html 
          transform 
          position={[width / 2, 0, -thickness / 2 - 0.01]} 
          rotation-y={Math.PI} 
          style={{ width: `500px`, height: `${500 * (height / width)}px`, opacity: 1 }}
          scale={width / 500}
        >
          {backContent}
        </Html>
      )}
    </group>
  );
}
