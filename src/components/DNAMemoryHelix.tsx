import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DNAMemoryHelixProps {
  position?: [number, number, number];
  height?: number;
  color?: string;
}

export const DNAMemoryHelix = ({
  position = [30, 0, -20],
  height = 20,
  color = '#8844ff'
}: DNAMemoryHelixProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const radius = 2;
    const turns = 4;
    const segments = 120;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      ));
    }

    return pts;
  }, [height]);

  const strand2 = useMemo(() => {
    return points.map(p => new THREE.Vector3(-p.x, p.y, -p.z));
  }, [points]);

  const rungs = useMemo(() => {
    const r: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    for (let i = 0; i < points.length; i += 8) {
      r.push({ start: points[i], end: strand2[i] });
    }
    return r;
  }, [points, strand2]);

  const helixGeo1 = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  const helixGeo2 = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(strand2);
  }, [strand2]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Strand 1 */}
      <line geometry={helixGeo1}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Strand 2 */}
      <line geometry={helixGeo2}>
        <lineBasicMaterial
          color="#00ffff"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </line>

      {/* Rungs */}
      {rungs.map((rung, i) => {
        const mid = new THREE.Vector3().addVectors(rung.start, rung.end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(rung.end, rung.start);
        const length = dir.length();
        dir.normalize();

        return (
          <mesh key={i} position={mid} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir)}>
            <boxGeometry args={[0.04, 0.04, length]} />
            <meshBasicMaterial
              color="#00ffff"
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};