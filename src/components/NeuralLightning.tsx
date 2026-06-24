import { useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NeuralLightningProps {
  count?: number;
  radius?: number;
  color?: string;
}

function generateArc(start: THREE.Vector3, end: THREE.Vector3, segments: number = 20): THREE.Vector3[] {
  const points: THREE.Vector3[] = [];
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const deviation = 2 + Math.random() * 4;
  mid.x += (Math.random() - 0.5) * deviation;
  mid.y += (Math.random() - 0.5) * deviation;
  mid.z += (Math.random() - 0.5) * deviation;

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = new THREE.Vector3()
      .copy(start)
      .lerp(mid, t)
      .lerp(new THREE.Vector3().copy(mid).lerp(end, t), t);
    // Add jitter
    p.x += (Math.random() - 0.5) * 0.3;
    p.y += (Math.random() - 0.5) * 0.3;
    p.z += (Math.random() - 0.5) * 0.3;
    points.push(p);
  }
  return points;
}

export const NeuralLightning = ({
  count = 8,
  radius = 12,
  color = '#00ffff'
}: NeuralLightningProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const flashRef = useRef(0);

  const arcs = useMemo(() => {
    const centers: THREE.Vector3[] = [];
    for (let i = 0; i < 50; i++) {
      centers.push(new THREE.Vector3(
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2,
        (Math.random() - 0.5) * radius * 2
      ));
    }

    return Array.from({ length: count }, () => {
      const start = centers[Math.floor(Math.random() * centers.length)].clone();
      const end = centers[Math.floor(Math.random() * centers.length)].clone();
      return {
        points: generateArc(start, end),
        delay: Math.random() * 8,
        duration: 0.3 + Math.random() * 0.5,
      };
    });
  }, [count, radius]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      if (i < arcs.length) {
        const arc = arcs[i];
        const cycleTime = (time - arc.delay) % 8;
        const active = cycleTime >= 0 && cycleTime < arc.duration;
        const opacity = active
          ? 0.8 * (1 - cycleTime / arc.duration) * (0.5 + 0.5 * Math.sin(time * 20))
          : 0;

        child.material.opacity = opacity;
        child.visible = opacity > 0.01;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(arc.points);
        return (
          <mesh key={i} geometry={geo}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
