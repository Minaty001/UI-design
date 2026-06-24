import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyStreamsProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const EnergyStreams = ({
  count = 80,
  radius = 6,
  color = '#00ffff'
}: EnergyStreamsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    const offsets = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + Math.random() * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      velocities[i] = 0.5 + Math.random() * 1.5;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    return { positions, velocities, offsets };
  }, [count, radius]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const dist = Math.sqrt(
        positions[i3] ** 2 +
        positions[i3 + 1] ** 2 +
        positions[i3 + 2] ** 2
      );

      const speed = (count + 1 - i) / count * 0.02;
      const dirX = -positions[i3] / dist;
      const dirY = -positions[i3 + 1] / dist;
      const dirZ = -positions[i3 + 2] / dist;

      positions[i3] += dirX * speed;
      positions[i3 + 1] += dirY * speed;
      positions[i3 + 2] += dirZ * speed;

      if (dist < 0.5) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
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
        size={0.2}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};