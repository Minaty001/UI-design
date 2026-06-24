import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CommandBarProps {
  position?: [number, number, number];
}

export const CommandBar = ({
  position = [0, -35, -10]
}: CommandBarProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const drawBar = (opacity: number) => {
    ctx.clearRect(0, 0, 1024, 128);

    // Background
    const grad = ctx.createLinearGradient(0, 0, 1024, 0);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0.0)');
    grad.addColorStop(0.1, `rgba(2, 6, 23, ${opacity * 0.6})`);
    grad.addColorStop(0.9, `rgba(2, 6, 23, ${opacity * 0.6})`);
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 128);

    // Top border
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.4})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 40);
    ctx.lineTo(924, 40);
    ctx.stroke();

    // Prompt character
    ctx.font = '28px Orbitron';
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
    ctx.fillText('>', 150, 85);

    // Blinking cursor
    const show = Math.floor(Date.now() / 500) % 2 === 0;
    if (show) {
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.9})`;
      ctx.fillRect(190, 58, 2, 28);
    }

    // Placeholder text
    ctx.font = '18px Rajdhani';
    ctx.fillStyle = `rgba(200, 200, 220, ${opacity * 0.3})`;
    ctx.fillText('ENTER COMMAND...', 200, 85);

    // Bottom border
    ctx.strokeStyle = `rgba(0, 102, 255, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(924, 100);
    ctx.stroke();

    // Corner decorations
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, 50);
    ctx.lineTo(110, 35);
    ctx.lineTo(130, 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(914, 50);
    ctx.lineTo(914, 35);
    ctx.lineTo(894, 35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(110, 90);
    ctx.lineTo(110, 105);
    ctx.lineTo(130, 105);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(914, 90);
    ctx.lineTo(914, 105);
    ctx.lineTo(894, 105);
    ctx.stroke();
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  useFrame((state) => {
    const opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    drawBar(opacity);
    texture.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[60, 8]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
