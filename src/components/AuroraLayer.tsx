import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface AuroraLayerProps {
  position?: [number, number, number];
  color?: string;
}

export const AuroraLayer = ({
  position = [0, 20, -80],
  color = '#8844ff'
}: AuroraLayerProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color]);

  useFrame((state) => {
    if (uniforms) {
      uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 0.05) * 10;
    }
  });

  const vertexShader = `
    uniform float uTime;
    varying vec2 vUv;
    varying float vHeight;
    void main() {
      vUv = uv;
      vec3 pos = position;
      float wave = sin(pos.x * 0.05 + uTime * 0.3) * 3.0;
      float wave2 = sin(pos.z * 0.03 + uTime * 0.2) * 2.0;
      pos.y += wave + wave2;
      vHeight = pos.y;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying float vHeight;
    void main() {
      float alpha = sin(vUv.x * 3.14) * sin(vUv.y * 3.14);
      alpha *= 0.15 + 0.1 * sin(uTime + vHeight * 0.1);
      float pulse = 0.5 + 0.5 * sin(uTime * 0.5);
      gl_FragColor = vec4(uColor, alpha * 0.3);
    }
  `;

  return (
    <mesh ref={meshRef} position={position} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[200, 80, 64, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};