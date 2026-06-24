import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface QuantumParticlesProps {
  count?: number;
  color?: string;
}

export const QuantumParticles = ({
  count = 5000,
  color = '#00ffff'
}: QuantumParticlesProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;
      velocities[i3] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    return { positions, velocities };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const center = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Simple attraction toward center
      pos[i3] += (center.x - pos[i3]) * 0.0003 + velocities[i3];
      pos[i3 + 1] += (center.y - pos[i3 + 1]) * 0.0003 + velocities[i3 + 1];
      pos[i3 + 2] += (center.z - pos[i3 + 2]) * 0.0003 + velocities[i3 + 2];

      // Orbital-like motion
      const vx = pos[i3 + 1] * 0.002;
      const vy = pos[i3 + 2] * 0.002;
      const vz = pos[i3] * 0.002;
      pos[i3] += vx;
      pos[i3 + 1] += vy;
      pos[i3 + 2] += vz;
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
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
