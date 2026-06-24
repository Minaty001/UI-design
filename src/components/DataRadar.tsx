import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface DataRadarProps {
  position?: [number, number, number];
}

export const DataRadar = ({
  position = [40, 5, -15]
}: DataRadarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const drawRadar = (opacity: number, rotation: number) => {
    ctx.clearRect(0, 0, 256, 256);

    // Outer ring
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(128, 128, 100, 0, Math.PI * 2);
    ctx.stroke();

    // Inner rings
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(128, 128, 70, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(128, 128, 40, 0, Math.PI * 2);
    ctx.stroke();

    // Crosshairs
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(128, 28);
    ctx.lineTo(128, 228);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(28, 128);
    ctx.lineTo(228, 128);
    ctx.stroke();

    // Scan line
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.15})`;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.arc(128, 128, 100, rotation, rotation + 0.5);
    ctx.closePath();
    ctx.fill();

    // Scan line stroke
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.lineTo(128 + Math.cos(rotation) * 100, 128 + Math.sin(rotation) * 100);
    ctx.stroke();

    // Blips
    const blips = [
      { angle: rotation + 0.3, dist: 50 },
      { angle: rotation + 1.2, dist: 80 },
      { angle: rotation + 2.5, dist: 35 },
      { angle: rotation + 3.8, dist: 65 },
    ];

    blips.forEach((blip) => {
      const bx = 128 + Math.cos(blip.angle) * blip.dist;
      const by = 128 + Math.sin(blip.angle) * blip.dist;

      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
      ctx.beginPath();
      ctx.arc(bx, by, 3, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.2})`;
      ctx.beginPath();
      ctx.arc(bx, by, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Center dot
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
    ctx.beginPath();
    ctx.arc(128, 128, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const opacity = 0.4 + Math.sin(time * 0.2) * 0.05;
    drawRadar(opacity, time * 0.8);
    texture.needsUpdate = true;

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time * 0.15) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[12, 12]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
