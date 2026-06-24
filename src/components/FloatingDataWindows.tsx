import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface FloatingDataWindowsProps {
  count?: number;
}

export const FloatingDataWindows = ({ count = 8 }: FloatingDataWindowsProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const windows = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 35 + Math.random() * 15;
      const height = (Math.random() - 0.5) * 30;
      return {
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius - 20,
        speed: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      };
    });
  }, [count]);

  return (
    <group ref={groupRef}>
      {windows.map((win, i) => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 80;
        const ctx = canvas.getContext('2d')!;

        const draw = (opacity: number) => {
          ctx.clearRect(0, 0, 128, 80);
          ctx.fillStyle = `rgba(2, 6, 23, ${opacity * 0.7})`;
          ctx.fillRect(0, 0, 128, 80);
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(1, 1, 126, 78);

          ctx.font = '8px Orbitron';
          ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.6})`;
          ctx.fillText(`NODE-${String(i).padStart(3, '0')}`, 8, 15);

          ctx.font = '7px Rajdhani';
          ctx.fillStyle = `rgba(200, 200, 220, ${opacity * 0.4})`;
          ctx.fillText(`DATA: ${Math.random().toString(16).slice(2, 10)}`, 8, 30);
          ctx.fillText(`PWR: ${(85 + Math.random() * 15).toFixed(1)}%`, 8, 42);

          ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.15})`;
          ctx.fillRect(8, 48, 112, 2);
          ctx.fillStyle = `rgba(0, 255, 255, ${opacity * 0.5})`;
          ctx.fillRect(8, 48, 112 * (0.7 + Math.random() * 0.3), 2);
        };

        const texture = new THREE.CanvasTexture(canvas);
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(8, 5),
          new THREE.MeshBasicMaterial({ map: texture, transparent, depthWrite: false })
        );

        return <FloatingWindow key={i} mesh={mesh} canvas={canvas} win={win} draw={draw} texture={texture} />;
      })}
    </group>
  );
};

function FloatingWindow({ mesh: initialMesh, canvas, win, draw, texture }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const opacity = 0.3 + Math.sin(time * win.speed + win.phase) * 0.1;
    draw(opacity);
    texture.needsUpdate = true;

    if (meshRef.current) {
      meshRef.current.position.x = win.x + Math.sin(time * win.speed * 2) * 2;
      meshRef.current.position.y = win.y + Math.sin(time * win.speed + win.phase) * 1;
      meshRef.current.position.z = win.z + Math.cos(time * win.speed) * 1;
    }
  });

  return (
    <mesh ref={meshRef} position={[win.x, win.y, win.z]}>
      <planeGeometry args={[8, 5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
