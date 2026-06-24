import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyArcsProps {
  count?: number;
  radius?: number;
  color?: string;
}

export const EnergyArcs = ({
  count = 15,
  radius = 8,
  color = '#8844ff'
}: EnergyArcsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const arcs = useMemo(() => {
    return Array.from({ length: count }, () => ({
      startAngle: Math.random() * Math.PI * 2,
      endAngle: Math.random() * Math.PI * 2,
      height: (Math.random() - 0.5) * radius * 2,
      startRadius: radius + (Math.random() - 0.5) * 3,
      endRadius: radius + (Math.random() - 0.5) * 3,
      speed: 0.2 + Math.random() * 0.5,
      delay: Math.random() * 5,
    }));
  }, [count, radius]);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;

      groupRef.current.children.forEach((child, i) => {
        if (i < count) {
          const arc = arcs[i];
          const t = Math.max(0, Math.min(1, (time - arc.delay) * 0.2));
          const visible = t > 0 && t < 1;

          if (child instanceof THREE.Mesh) {
            child.visible = visible;
            if (visible) {
              const scale = t;
              child.scale.set(scale, scale, scale);
              child.position.y = arc.height;
            }
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {arcs.map((arc, i) => {
        const points: THREE.Vector3[] = [];
        const steps = 20;

        for (let j = 0; j <= steps; j++) {
          const t = j / steps;
          const angle = arc.startAngle + (arc.endAngle - arc.startAngle) * t;
          const r = arc.startRadius + (arc.endRadius - arc.startRadius) * t;
          const height = Math.sin(t * Math.PI) * 3;

          points.push(new THREE.Vector3(
            Math.cos(angle) * r,
            height,
            Math.sin(angle) * r
          ));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const curvePoints = curve.getPoints(steps);
        const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);

        return (
          <mesh key={i} geometry={geometry}>
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}
    </group>
  );
};