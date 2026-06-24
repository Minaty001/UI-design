import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyVeinsProps {
  count?: number;
  radius?: number;
  color?: string;
}

function growBranch(
  origin: THREE.Vector3,
  direction: THREE.Vector3,
  depth: number,
  points: THREE.Vector3[]
) {
  if (depth <= 0) return;
  const length = 2 + Math.random() * 4;
  const end = origin.clone().add(direction.clone().multiplyScalar(length));
  points.push(origin.clone(), end);

  if (depth > 1) {
    const branches = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < branches; i++) {
      const newDir = direction.clone().add(
        new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        )
      ).normalize();
      growBranch(end, newDir, depth - 1, points);
    }
  }
}

export const EnergyVeins = ({
  count = 5,
  radius = 15,
  color = '#8844ff'
}: EnergyVeinsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];

    for (let i = 0; i < count; i++) {
      const points: THREE.Vector3[] = [];
      const origin = new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      );
      const direction = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5),
        (Math.random() - 0.5)
      ).normalize();
      growBranch(origin, direction, 3 + Math.floor(Math.random() * 3), points);

      if (points.length >= 2) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(points.length * 3);
        points.forEach((p, i) => {
          positions[i * 3] = p.x;
          positions[i * 3 + 1] = p.y;
          positions[i * 3 + 2] = p.z;
        });
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geos.push(geo);
      }
    }
    return geos;
  }, [count, radius]);

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <lineSegments key={i} geometry={geo}>
          <lineBasicMaterial
            color={color}
            transparent
            opacity={0.15 + Math.random() * 0.15}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      ))}
    </group>
  );
};
