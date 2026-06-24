import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ShockwaveSystem = () => {
  const ringRef = useRef<THREE.Mesh>(null);
  const startTime = useRef(Date.now());

  // Create a shared ring geometry
  const geometry = useMemo(() => new THREE.RingGeometry(0.1, 0.3, 64), []);

  useFrame((state) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const cycleTime = 5; // seconds between shockwaves
    const t = (elapsed % cycleTime) / cycleTime;

    if (ringRef.current) {
      // Scale expands and fades
      const progress = Math.min(t * 3, 1); // Expand over first 1/3 of cycle
      const scale = 1 + progress * 15;
      const opacity = (1 - progress) * 0.5;

      ringRef.current.scale.set(scale, scale, scale);
      ringRef.current.material.opacity = opacity;

      // Reset when cycle completes
      if (t < 0.01) {
        ringRef.current.scale.set(1, 1, 1);
        ringRef.current.material.opacity = 0.3;
      }
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.5, 0.8, 64]} />
      <meshBasicMaterial
        color="#00ffff"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
};