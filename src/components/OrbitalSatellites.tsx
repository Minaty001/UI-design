import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface OrbitalSatellitesProps {
  count?: number;
  orbitRadius?: number;
  color?: string;
}

export const OrbitalSatellites = ({
  count = 12,
  orbitRadius = 9,
  color = '#8844ff'
}: OrbitalSatellitesProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const satellites = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      tilt: (Math.random() - 0.5) * 0.5,
      radius: orbitRadius + (Math.random() - 0.5) * 2,
      size: 0.15 + Math.random() * 0.15,
    }));
  }, [count, orbitRadius]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      
      groupRef.current.children.forEach((child, i) => {
        if (i < count) {
          const sat = satellites[i];
          const angle = sat.angle + time * sat.speed;
          
          child.position.x = Math.cos(angle) * sat.radius;
          child.position.z = Math.sin(angle) * sat.radius;
          child.position.y = Math.sin(angle * 2) * sat.tilt * sat.radius;
          
          child.rotation.x = time * 2;
          child.rotation.y = time * 3;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {satellites.map((_, i) => (
        <mesh key={i}>
          <octahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial 
            color={color}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};