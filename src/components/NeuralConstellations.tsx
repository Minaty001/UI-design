import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NeuralConstellationsProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const NeuralConstellations = ({
  count = 80,
  radius = 30,
  color = '#00ffff'
}: NeuralConstellationsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const groups = useMemo(() => {
    const gs: { positions: THREE.Vector3[]; connections: [number, number][] }[] = [];

    for (let g = 0; g < 6; g++) {
      const center = new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      );
      const groupSize = 8 + Math.floor(Math.random() * 12);
      const positions: THREE.Vector3[] = [];

      for (let i = 0; i < groupSize; i++) {
        positions.push(new THREE.Vector3(
          center.x + (Math.random() - 0.5) * 6,
          center.y + (Math.random() - 0.5) * 6,
          center.z + (Math.random() - 0.5) * 6
        ));
      }

      const connections: [number, number][] = [];
      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          if (Math.random() > 0.6) {
            connections.push([i, j]);
          }
        }
      }

      gs.push({ positions, connections });
    }

    return gs;
  }, [count, radius]);

  return (
    <group ref={groupRef}>
      {groups.map((g, gi) => (
        <group key={gi}>
          {g.positions.map((pos, pi) => (
            <mesh key={pi} position={pos}>
              <sphereGeometry args={[0.15, 6, 6]} />
              <meshBasicMaterial
                color={color}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          ))}
          {g.connections.map(([i, j], ci) => {
            const points = [g.positions[i], g.positions[j]];
            const geo = new THREE.BufferGeometry().setFromPoints(points);
            return (
              <line key={ci} geometry={geo}>
                <lineBasicMaterial
                  color={color}
                  transparent
                  opacity={0.15}
                  blending={THREE.AdditiveBlending}
                />
              </line>
            );
          })}
        </group>
      ))}
    </group>
  );
};
