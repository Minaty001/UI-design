import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { spaceBackgroundVertex, spaceBackgroundFragment } from '../shaders/spaceBackground';

interface SpaceBackgroundProps {
  starCount?: number;
}

export const SpaceBackground = ({ starCount = 5000 }: SpaceBackgroundProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 100 + Math.random() * 400;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      sizes[i] = Math.random() * 2 + 0.5;
    }
    
    return { positions, sizes };
  }, [starCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={spaceBackgroundVertex}
        fragmentShader={spaceBackgroundFragment}
        transparent
        depthWrite={false}
      />
    </points>
  );
};