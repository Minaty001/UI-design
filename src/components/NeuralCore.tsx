import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { coreVertex, coreFragment } from '../shaders/neuralCore';

interface NeuralCoreProps {
  position?: [number, number, number];
  coreColor?: string;
  accentColor?: string;
  onCoreClick?: () => void;
}

export const NeuralCore = ({ 
  position = [0, 0, 0],
  coreColor = '#0066ff',
  accentColor = '#00ffff',
  onCoreClick
}: NeuralCoreProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const uniforms = useMemo(() => ({
    time: { value: 0 },
    coreColor: { value: new THREE.Color(coreColor) },
    accentColor: { value: new THREE.Color(accentColor) },
  }), [coreColor, accentColor]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (uniforms) {
      uniforms.time.value = time;
    }
    
    if (meshRef.current) {
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    }
    
    if (pulseRef.current) {
      const pulse = 1 + Math.sin(time * 2) * 0.05;
      pulseRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const handleClick = () => {
    onCoreClick?.();
  };

  return (
    <group position={position}>
      {/* Inner Core */}
      <mesh ref={meshRef} onClick={handleClick}>
        <sphereGeometry args={[3, 64, 64]} />
        <shaderMaterial
          vertexShader={coreVertex}
          fragmentShader={coreFragment}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Pulse Ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 3.8, 64]} />
        <meshBasicMaterial 
          color={accentColor} 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer Glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 5.5, 64]} />
        <meshBasicMaterial 
          color={coreColor} 
          transparent 
          opacity={0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};