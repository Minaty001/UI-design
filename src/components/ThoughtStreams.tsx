import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface ThoughtStreamsProps {
  count?: number;
  color?: string;
}

export const ThoughtStreams = ({
  count = 5,
  color = '#8844ff'
}: ThoughtStreamsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const streams = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 10 + Math.random() * 5;
      const points: THREE.Vector3[] = [];
      const segments = 40;

      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const spiral = t * Math.PI * 4;
        const x = Math.cos(spiral + angle) * r * (0.5 + t * 0.5);
        const y = (t - 0.5) * 20;
        const z = Math.sin(spiral + angle) * r * (0.5 + t * 0.5);
        points.push(new THREE.Vector3(x, y, z));
      }

      return points;
    });
  }, [count]);

  return (
    <group ref={groupRef}>
      {streams.map((points, i) => {
        const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              blending={THREE.AdditiveBlending}
            />
          </line>
        );
      })}
    </group>
  );
};
