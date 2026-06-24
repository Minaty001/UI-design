import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface OrbitRingProps {
  radius: number;
  tilt?: number;
  rotationSpeed?: number;
  color?: string;
  thickness?: number;
}

export const OrbitRing = ({ 
  radius = 6,
  tilt = 0.5,
  rotationSpeed = 0.5,
  color = '#00ffff',
  thickness = 0.05
}: OrbitRingProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ringRef.current) {
      ringRef.current.rotation.y = time * rotationSpeed;
      ringRef.current.rotation.x = tilt + Math.sin(time * 0.3) * 0.1;
    }
    
    if (glowRef.current) {
      glowRef.current.rotation.y = time * rotationSpeed * 0.8;
      glowRef.current.rotation.x = tilt - Math.sin(time * 0.3) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={ringRef}>
        <torusGeometry args={[radius, thickness, 16, 100]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={glowRef}>
        <torusGeometry args={[radius, thickness * 2, 16, 100]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};