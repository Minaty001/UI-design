import { useRef, useMemo, createElement } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CircularTextRingProps {
  radius?: number;
  texts?: string[];
  color?: string;
  speed?: number;
}

export const CircularTextRing = ({
  radius = 8.5,
  texts = ['MEMORY', 'NEURAL', 'SYSTEM', 'CORE', 'AI', 'QUANTUM'],
  color = '#00ffff',
  speed = 0.15
}: CircularTextRingProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const chars = useMemo(() => {
    const allText = texts.join('');
    return allText.split('').map((char, i) => ({
      char,
      angle: (i / allText.length) * Math.PI * 2,
    }));
  }, [texts]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * speed;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {chars.map(({ char, angle }, i) => {
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <sprite key={i} position={[x, 0, z]}>
            <spriteMaterial
              color={color}
              transparent
              opacity={0.7}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
};