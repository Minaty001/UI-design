import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NeuralRainProps {
  count?: number;
  color?: string;
  opacity?: number;
}

export const NeuralRain = ({
  count = 500,
  color = '#00ffff',
  opacity = 0.3
}: NeuralRainProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 300;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 300 - 50;
      speeds[i] = 0.5 + Math.random() * 1.5;
    }
    
    return { positions, speeds };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] -= speeds[i] * 0.3;
      
      if (positions[i3 + 1] < -100) {
        positions[i3 + 1] = 100;
        positions[i3] = (Math.random() - 0.5) * 300;
        positions[i3 + 2] = (Math.random() - 0.5) * 300 - 50;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={0.5}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};