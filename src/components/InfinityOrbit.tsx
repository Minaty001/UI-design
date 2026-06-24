import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface InfinityOrbitProps {
  scale?: number;
  color?: string;
  speed?: number;
}

export const InfinityOrbit = ({
  scale = 5,
  color = '#8844ff',
  speed = 0.5
}: InfinityOrbitProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const particleRef = useRef<THREE.Mesh>(null);

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const a = scale;
    const b = scale * 0.4;

    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * Math.PI * 2;
      const x = a * Math.cos(t) / (1 + Math.sin(t) * Math.sin(t));
      const z = b * Math.cos(t) * Math.sin(t) / (1 + Math.sin(t) * Math.sin(t));
      points.push(new THREE.Vector3(x, 0, z));
    }

    return new THREE.CatmullRomCurve3(points, true);
  }, [scale]);

  const geometry = useMemo(() => {
    const points = curve.getPoints(100);
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [curve]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.5;
      meshRef.current.rotation.z = time * 0.1;
    }

    if (particleRef.current) {
      const t = (time * speed * 0.3) % 1;
      const pos = curve.getPoint(t);
      particleRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} rotation={[Math.PI / 4, 0, 0]}>
        <bufferGeometry geometry={geometry} />
        <lineBasicMaterial 
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Orbiting particle */}
      <mesh ref={particleRef}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};