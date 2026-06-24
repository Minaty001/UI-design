import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ScannerRingProps {
  radius?: number;
  speed?: number;
  color?: string;
}

export const ScannerRing = ({ 
  radius = 7,
  speed = 1,
  color = '#00ffff'
}: ScannerRingProps) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const scanRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (ringRef.current) {
      ringRef.current.rotation.y = time * speed * 0.3;
    }
    
    if (scanRef.current) {
      scanRef.current.rotation.y = time * speed * 2;
    }
  });

  return (
    <group>
      {/* Static Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius, radius + 0.2, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Scanning Beam */}
      <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.1, 16, 32, Math.PI / 4]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer Glow Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.5, radius + 0.8, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};