import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface EnergyHaloProps {
  radius?: number;
  color?: string;
  speed?: number;
  opacity?: number;
}

export const EnergyHalo = ({
  radius = 4.5,
  color = '#00ffff',
  speed = 0.8,
  opacity = 0.4
}: EnergyHaloProps) => {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (outerRef.current) {
      outerRef.current.rotation.z = time * speed * 0.5;
      const scale = 1 + Math.sin(time * 0.8) * 0.05;
      outerRef.current.scale.set(scale, scale, scale);
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.z = -time * speed * 0.7;
      const scale = 1 + Math.sin(time * 0.5 + 2) * 0.03;
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      {/* Outer Halo */}
      <mesh ref={outerRef} rotation={[0.3, 0.2, 0]}>
        <torusGeometry args={[radius, 0.03, 8, 80]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={opacity}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner Halo */}
      <mesh ref={innerRef} rotation={[-0.2, 0.4, 0]}>
        <torusGeometry args={[radius * 0.85, 0.02, 8, 80]} />
        <meshBasicMaterial 
          color="#8844ff" 
          transparent 
          opacity={opacity * 0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Double Halo */}
      <mesh rotation={[0.5, -0.3, 0]}>
        <torusGeometry args={[radius * 1.15, 0.015, 8, 80]} />
        <meshBasicMaterial 
          color="#0066ff" 
          transparent 
          opacity={opacity * 0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};