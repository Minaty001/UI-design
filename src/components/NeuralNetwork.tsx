import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface NeuralNetworkProps {
  nodeCount?: number;
  connectionDistance?: number;
  radius?: number;
  color?: string;
}

export const NeuralNetwork = ({
  nodeCount = 200,
  connectionDistance = 12,
  radius = 25,
  color = '#00ffff'
}: NeuralNetworkProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  const pulseRef = useRef<THREE.Points>(null);

  const { nodePositions, connections, pulsePositions } = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const conns: number[] = [];
    const pulses: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * (0.3 + Math.random() * 0.7);

      positions.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));

      pulses.push(Math.random() * 100);
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < connectionDistance) {
          conns.push(positions[i].x, positions[i].y, positions[i].z);
          conns.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }

    return {
      nodePositions: positions,
      connections: new Float32Array(conns),
      pulsePositions: new Float32Array(pulses),
    };
  }, [nodeCount, connectionDistance, radius]);

  const nodeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const posArray = new Float32Array(nodePositions.length * 3);
    nodePositions.forEach((p, i) => {
      posArray[i * 3] = p.x;
      posArray[i * 3 + 1] = p.y;
      posArray[i * 3 + 2] = p.z;
    });
    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    return geo;
  }, [nodePositions]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(connections, 3));
    return geo;
  }, [connections]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
      groupRef.current.rotation.x = Math.sin(time * 0.05) * 0.05;
    }

    if (pulseRef.current) {
      const positions = pulseRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < nodeCount; i++) {
        positions[i] = (time * 5 + pulsePositions[i]) % connectionDistance;
      }
      pulseRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points geometry={nodeGeometry}>
        <pointsMaterial
          color={color}
          size={0.3}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Connections */}
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};