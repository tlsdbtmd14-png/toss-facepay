import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function TossLogo(props: any) {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  // Load the user's uploaded GLB file
  const { scene } = useGLTF('/Hitem3d-1779382545676.glb');

  useFrame((state) => {
    if (groupRef.current) {
      const offset = scroll.offset;

      // Smooth floating animation (keeps it feeling alive)
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.15;
      
      // Rotation driven entirely by scroll!
      // Math.PI * 4 means it will spin 2 full times as you scroll to the end
      groupRef.current.rotation.y = offset * Math.PI * 4;
      groupRef.current.rotation.x = offset * Math.PI * 0.5;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/Hitem3d-1779382545676.glb');
