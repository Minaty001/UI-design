import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GridFloorProps {
  size?: number;
  divisions?: number;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
}

export const GridFloor = ({
  size = 200,
  divisions = 80,
  color = '#0066ff',
  opacity = 0.15,
  position = [0, -12, 0]
}: GridFloorProps) => {
  const gridRef = useRef<THREE.Group>(null);

  const { positions } = useMemo(() => {
    const half = size / 2;
    const step = size / divisions;
    const pos: number[] = [];
    
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const x = i * step;
      const z = -half;
      const z2 = half;
      pos.push(x, 0, z, x, 0, z2);
    }
    
    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      const z = i * step;
      const x = -half;
      const x2 = half;
      pos.push(x, 0, z, x2, 0, z);
    }
    
    return { positions: new Float32Array(pos) };
  }, [size, divisions]);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 2) % step;
    }
  });

  const step = size / divisions;

  return (
    <group ref={gridRef} position={position}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
};