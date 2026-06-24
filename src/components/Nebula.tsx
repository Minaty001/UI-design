import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { nebulaVertex, nebulaFragment } from '../shaders/nebula';

interface NebulaProps {
  position?: [number, number, number];
  color1?: string;
  color2?: string;
  color3?: string;
}

export const Nebula = ({ 
  position = [0, 0, -100],
  color1 = '#0066ff',
  color2 = '#8844ff',
  color3 = '#00ffff'
}: NebulaProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemoUniforms(color1, color2, color3);

  useFrame((state) => {
    if (uniforms) {
      uniforms.time.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[800, 800, 64, 64]} />
      <shaderMaterial
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

function useMemoUniforms(color1: string, color2: string, color3: string) {
  return {
    time: { value: 0 },
    color1: { value: new THREE.Color(color1) },
    color2: { value: new THREE.Color(color2) },
    color3: { value: new THREE.Color(color3) },
  };
}