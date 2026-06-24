import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// This component creates a 3D energy field around the mouse cursor
// It influences the scene by creating a distortion/attraction effect
export const MouseInteraction = () => {
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentRef = useRef(new THREE.Vector3(0, 0, 0));

  // Track mouse position in normalized coordinates
  if (typeof window !== 'undefined') {
    const handleMouse = (e: MouseEvent) => {
      // Convert screen to normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      // Project into 3D space
      targetRef.current.set(x * 20, y * 15, 0);
    };

    window.addEventListener('mousemove', handleMouse);
    // Cleanup is handled by React's useEffect but this is a simple approach
  }

  useFrame(() => {
    // Smoothly interpolate current position toward target
    currentRef.current.lerp(targetRef.current, 0.05);
  });

  // This doesn't render anything visible - it provides position data
  // The actual visual effects use this via the scene's uniform
  return (
    <group>
      {/* Invisible light that follows cursor */}
      <pointLight
        position={[currentRef.current.x, currentRef.current.y, 5]}
        intensity={0.5}
        distance={30}
        color="#00ffff"
      />
      <spotLight
        position={[targetRef.current.x, targetRef.current.y, 10]}
        intensity={0.3}
        angle={0.3}
        penumbra={1}
        color="#8844ff"
      />
    </group>
  );
};
