import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CrystalFragmentsProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const CrystalFragments = ({
  count = 40,
  radius = 7,
  color = '#00ffff'
}: CrystalFragmentsProps) => {
  const groupRef = useRef<THREE.Group>(null);
  
  const crystals = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      ).normalize().multiplyScalar(radius + (Math.random() - 0.5) * 2),
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
      color: [color, '#8844ff', '#0066ff'][Math.floor(Math.random() * 3)]
    }));
  }, [count, radius, color]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.05;
      
      groupRef.current.children.forEach((child, i) => {
        if (i < count) {
          const crystal = crystals[i];
          const t = state.clock.elapsedTime * crystal.speed + crystal.offset;
          
          child.position.x = crystal.position.x + Math.sin(t * 2) * 0.5;
          child.position.y = crystal.position.y + Math.cos(t * 1.7) * 0.5;
          child.position.z = crystal.position.z + Math.sin(t * 1.3) * 0.5;
          
          child.rotation.x += 0.01;
          child.rotation.y += 0.02;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {crystals.map((crystal, i) => (
        <mesh key={i} position={crystal.position} scale={crystal.scale}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshPhysicalMaterial
            color={crystal.color}
            emissive={crystal.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};