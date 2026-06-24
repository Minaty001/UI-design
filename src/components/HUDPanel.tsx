import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface HUDPanelProps {
  position?: [number, number, number];
  width?: number;
  height?: number;
  title?: string;
  items?: { label: string; value: string; color?: string }[];
  side?: 'left' | 'right';
}

export const HUDPanel = ({
  position = [-40, 5, -15],
  width = 18,
  height = 30,
  title = 'NEURAL ACTIVITY',
  items = [
    { label: 'SYNAPTIC', value: '87.3%', color: '#00ffff' },
    { label: 'COGNITIVE', value: '92.1%', color: '#8844ff' },
    { label: 'PROCESSING', value: '74.6%', color: '#0066ff' },
    { label: 'MEMORY', value: '63.8%', color: '#00ffff' },
    { label: 'QUANTUM', value: '99.2%', color: '#8844ff' },
  ],
  side = 'left'
}: HUDPanelProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const panelOpacity = useRef(0.3);

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 800;
  const ctx = canvas.getContext('2d')!;

  const drawPanel = (opacity: number) => {
    ctx.clearRect(0, 0, 512, 800);

    // Background
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, `rgba(2, 6, 23, ${opacity * 0.8})`);
    grad.addColorStop(1, `rgba(2, 6, 23, ${opacity * 0.3})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 800);

    // Border
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(2, 2, 508, 796);

    // Title
    ctx.font = '18px Orbitron';
    ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.8})`;
    ctx.fillText(title, 20, 45);

    // Decorative line under title
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 55);
    ctx.lineTo(492, 55);
    ctx.stroke();

    // Items
    items.forEach((item, i) => {
      const y = 90 + i * 70;

      // Label
      ctx.font = '12px Rajdhani';
      ctx.fillStyle = `rgba(200, 200, 220, ${opacity * 0.7})`;
      ctx.fillText(item.label, 20, y);

      // Value
      ctx.font = '24px Orbitron';
      ctx.fillStyle = item.color || `rgba(0, 255, 255, ${opacity * 0.9})`;
      ctx.fillText(item.value, 20, y + 35);

      // Progress bar background
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.1})`;
      ctx.fillRect(20, y + 42, 472, 3);

      // Progress bar fill
      const percent = parseFloat(item.value) / 100;
      ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
      ctx.fillRect(20, y + 42, 472 * percent, 3);
    });

    // Corner decorations
    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(10, 30);
    ctx.lineTo(10, 10);
    ctx.lineTo(30, 10);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(502, 30);
    ctx.lineTo(502, 10);
    ctx.lineTo(482, 10);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(10, 770);
    ctx.lineTo(10, 790);
    ctx.lineTo(30, 790);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(502, 770);
    ctx.lineTo(502, 790);
    ctx.lineTo(482, 790);
    ctx.stroke();
  };

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  useEffect(() => {
    drawPanel(0.3);
    texture.needsUpdate = true;
  }, []);

  useFrame((state) => {
    const targetOpacity = 0.3 + Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    panelOpacity.current += (targetOpacity - panelOpacity.current) * 0.01;
    drawPanel(panelOpacity.current);
    texture.needsUpdate = true;

    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};
