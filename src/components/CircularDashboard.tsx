import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CircularDashboardProps {
  position?: [number, number, number];
}

export const CircularDashboard = ({
  position = [-40, -15, -10]
}: CircularDashboardProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const draw = (opacity: number) => {
    ctx.clearRect(0, 0, 256, 256);
    const cx = 128, cy = 128, r = 100;

    // Outer ring
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Progress arcs
    const values = [0.87, 0.65, 0.42];
    const colors = ['#00ffff', '#8844ff', '#0066ff'];
    const offsets = [0, 2.1, 4.2];

    values.forEach((val, i) => {
      const start = offsets[i];
      const end = start + val * Math.PI * 1.5;

      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(cx, cy, r - 10 - i * 25, start, end);
      ctx.stroke();

      // Glow
      ctx.shadowColor = colors[i];
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Center text
    ctx.font = '12px Orbitron';
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
    ctx.textAlign = 'center';
    ctx.fillText('CORE', cx, cy - 10);

    ctx.font = '32px Orbitron';
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.9})`;
    ctx.fillText('98%', cx, cy + 10);

    // Tick marks
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const len = i % 4 === 0 ? 10 : 5;
      ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * (r - 2), cy + Math.sin(angle) * (r - 2));
      ctx.lineTo(cx + Math.cos(angle) * (r - 2 - len), cy + Math.sin(angle) * (r - 2 - len));
      ctx.stroke();
    }
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  useFrame((state) => {
    const opacity = 0.5 + Math.sin(state.clock.elapsedTime * 0.25) * 0.05;
    draw(opacity);
    texture.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[14, 14]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
