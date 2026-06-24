import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface MemoryNodesProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const MemoryNodes = ({
  count = 60,
  radius = 18,
  color = '#0066ff'
}: MemoryNodesProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      ),
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.02;

      groupRef.current.children.forEach((child, i) => {
        if (i < count) {
          const node = nodes[i];
          const pulse = 1 + Math.sin(time * node.speed + node.phase) * 0.1;
          child.scale.set(pulse * node.scale, pulse * node.scale, pulse * node.scale);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};