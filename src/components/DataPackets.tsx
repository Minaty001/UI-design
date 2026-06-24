import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DataPacketsProps {
  count?: number;
  color?: string;
}

export const DataPackets = ({
  count = 30,
  color = '#00ffff'
}: DataPacketsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const packets = useMemo(() => {
    return Array.from({ length: count }, () => ({
      start: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60
      ),
      end: new THREE.Vector3(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60
      ),
      speed: 0.1 + Math.random() * 0.3,
      offset: Math.random() * 100,
    }));
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;

      groupRef.current.children.forEach((child, i) => {
        if (i < count) {
          const packet = packets[i];
          const t = ((time * packet.speed + packet.offset) % 1);
          const pos = new THREE.Vector3().lerpVectors(packet.start, packet.end, t);

          child.position.copy(pos);

          const alpha = Math.sin(t * Math.PI);
          (child as THREE.Mesh).material.opacity = alpha * 0.8;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {packets.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.25, 6, 6]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};