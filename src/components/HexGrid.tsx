import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { hexVertex, hexFragment } from '../shaders/hexGrid';

const HEX_SIZE = 8;
const GRID_ROWS = 20;
const GRID_COLS = 30;

interface HexGridProps {
  position?: [number, number, number];
  activeColor?: string;
  inactiveColor?: string;
}

export const HexGrid = ({ 
  position = [0, -30, -50],
  activeColor = '#00ffff',
  inactiveColor = '#003366'
}: HexGridProps) => {
  const pointsRef = useRef<THREE.Points>(null);
  
  const { positions, activations, timeOffsets } = useMemo(() => {
    const positions: number[] = [];
    const activations: number[] = [];
    const timeOffsets: number[] = [];
    
    const hexHeight = HEX_SIZE * Math.sqrt(3);
    const hexWidth = HEX_SIZE * 2;
    
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const xOffset = (row % 2) * (hexWidth / 2);
        const x = col * hexWidth - (GRID_COLS * hexWidth) / 2 + xOffset;
        const y = row * hexHeight - (GRID_ROWS * hexHeight) / 2;
        
        positions.push(x, y, 0);
        activations.push(Math.random());
        timeOffsets.push(Math.random() * Math.PI * 2);
      }
    }
    
    return {
      positions: new Float32Array(positions),
      activations: new Float32Array(activations),
      timeOffsets: new Float32Array(timeOffsets),
    };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-activation"
          count={activations.length}
          array={activations}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-timeOffset"
          count={timeOffsets.length}
          array={timeOffsets}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={hexVertex}
        fragmentShader={hexFragment}
        uniforms={{
          time: { value: 0 },
          activeColor: { value: new THREE.Color(activeColor) },
          inactiveColor: { value: new THREE.Color(inactiveColor) },
        }}
        transparent
        depthWrite={false}
      />
    </points>
  );
};