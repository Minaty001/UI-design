import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraControllerProps {
  speed?: number;
  amplitude?: number;
}

export const CameraController = ({ 
  speed = 0.1, 
  amplitude = 1.5 
}: CameraControllerProps) => {
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const camera = state.camera;
    
    // Slow drift
    camera.position.x = Math.sin(time * speed * 0.5) * amplitude * 0.5;
    camera.position.y = 3 + Math.sin(time * speed * 0.3) * amplitude * 0.2;
    
    // Breathing motion
    const breathe = 1 + Math.sin(time * 0.2) * 0.003;
    camera.position.z = 25 * breathe;
    
    // Subtle look-at variation
    camera.lookAt(
      Math.sin(time * speed * 0.1) * 0.2,
      Math.sin(time * speed * 0.08) * 0.1,
      0
    );
  });

  return null;
};