import { Canvas } from '@react-three/fiber';
import { SpaceBackground } from './SpaceBackground';
import { Nebula } from './Nebula';
import { HexGrid } from './HexGrid';
import { GridFloor } from './GridFloor';
import { AuroraLayer } from './AuroraLayer';
import { NeuralRain } from './NeuralRain';
import { NeuralFog } from './NeuralFog';
import { NeuralCore } from './NeuralCore';
import { EnergyHalo } from './EnergyHalo';
import { OrbitRing } from './OrbitRing';
import { ScannerRing } from './ScannerRing';
import { InfinityOrbit } from './InfinityOrbit';
import { EnergyStreams } from './EnergyStreams';
import { CrystalFragments } from './CrystalFragments';
import { OrbitalSatellites } from './OrbitalSatellites';
import { CircularTextRing } from './CircularTextRing';
import { NeuralNetwork } from './NeuralNetwork';
import { EnergyArcs } from './EnergyArcs';
import { NeuralParticles } from './NeuralParticles';
import { MemoryNodes } from './MemoryNodes';
import { DNAMemoryHelix } from './DNAMemoryHelix';
import { DataPackets } from './DataPackets';
import { NeuralConstellations } from './NeuralConstellations';
import { ThoughtStreams } from './ThoughtStreams';
import { QuantumParticles } from './QuantumParticles';
import { HUDPanel } from './HUDPanel';
import { CommandBar } from './CommandBar';
import { DataRadar } from './DataRadar';
import { CircularDashboard } from './CircularDashboard';
import { FloatingDataWindows } from './FloatingDataWindows';
import { CameraController } from './CameraController';
import { ShockwaveSystem } from './ShockwaveSystem';
import { PostProcessing } from './PostProcessing';
import { Suspense } from 'react';
import * as THREE from 'three';

interface MasterSceneProps {
  onCoreClick?: () => void;
}

export const MasterScene = ({ onCoreClick }: MasterSceneProps) => {
  return (
    <Canvas
      camera={{ position: [0, 3, 25], fov: 60, near: 0.1, far: 1000 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{ position: 'fixed', inset: 0 }}
    >
      {/* ============== BACKGROUND LAYER (Layer 0) ============== */}
      <Suspense fallback={null}>
        <SpaceBackground starCount={5000} />
        <Nebula position={[0, 0, -200]} color1="#0066ff" color2="#8844ff" color3="#00ffff" />
        <Nebula position={[100, 50, -150]} color1="#8844ff" color2="#0066ff" color3="#00ffff" />
        <Nebula position={[-80, -30, -180]} color1="#00ffff" color2="#0066ff" color3="#8844ff" />
      </Suspense>

      {/* ============== ATMOSPHERE LAYER (Layer 1) ============== */}
      <AuroraLayer position={[0, 15, -80]} color="#8844ff" />
      <AuroraLayer position={[0, -10, -85]} color="#0066ff" />
      <NeuralRain count={400} color="#00ffff" opacity={0.2} />
      <NeuralFog count={600} color="#0066ff" size={2} opacity={0.06} position={[0, 0, -40]} />
      <NeuralFog count={400} color="#8844ff" size={1.5} opacity={0.04} position={[0, 0, -30]} />

      {/* ============== HEX GRID LAYER (Layer 2) ============== */}
      <HexGrid position={[0, -25, -40]} activeColor="#00ffff" inactiveColor="#003366" />

      {/* ============== NEURAL NETWORK LAYER (Layer 3) ============== */}
      <NeuralNetwork nodeCount={180} connectionDistance={10} radius={22} color="#0066ff" />
      <NeuralConstellations count={60} radius={28} color="#00ffff" />
      <EnergyArcs count={12} radius={8} color="#8844ff" />
      <ThoughtStreams count={4} color="#8844ff" />
      <MemoryNodes count={40} radius={16} color="#0066ff" />
      <DNAMemoryHelix position={[28, 0, -18]} height={16} color="#8844ff" />
      <DataPackets count={25} color="#00ffff" />
      <QuantumParticles count={4000} color="#00ffff" />

      {/* ============== GRID FLOOR ============== */}
      <GridFloor position={[0, -8, 0]} color="#0066ff" opacity={0.1} />

      {/* ============== CORE LAYER (Layer 4) ============== */}
      <NeuralCore position={[0, 0, 0]} coreColor="#0066ff" accentColor="#00ffff" onCoreClick={onCoreClick} />

      {/* Energy Streams - flowing into core */}
      <EnergyStreams count={60} radius={7} color="#00ffff" />

      {/* ============== RINGS LAYER (Layer 5) ============== */}
      <EnergyHalo radius={4.5} color="#00ffff" speed={0.8} opacity={0.4} />
      <OrbitRing radius={5.5} tilt={0.8} rotationSpeed={0.6} color="#00ffff" thickness={0.03} />
      <OrbitRing radius={6.5} tilt={1.2} rotationSpeed={-0.4} color="#8844ff" thickness={0.03} />
      <OrbitRing radius={7.5} tilt={0.3} rotationSpeed={0.5} color="#0066ff" thickness={0.02} />
      <ScannerRing radius={7} speed={1.2} color="#00ffff" />
      <InfinityOrbit scale={5.5} color="#8844ff" speed={0.4} />
      <CrystalFragments count={30} radius={6.5} color="#00ffff" />
      <OrbitalSatellites count={10} orbitRadius={8.5} color="#8844ff" />
      <CircularTextRing radius={9.5} texts={['MEMORY', 'NEURAL', 'SYSTEM', 'CORE', 'AI', 'QUANTUM']} color="#00ffff" speed={0.12} />
      <ShockwaveSystem />
      <NeuralParticles count={1200} radius={15} color="#00ffff" />

      {/* ============== HUD LAYER (Layer 6) ============== */}
      <HUDPanel
        position={[-32, 4, -10]}
        side="left"
        title="NEURAL ACTIVITY"
        items={[
          { label: 'SYNAPTIC', value: '87.3%', color: '#00ffff' },
          { label: 'COGNITIVE', value: '92.1%', color: '#8844ff' },
          { label: 'PROCESSING', value: '74.6%', color: '#0066ff' },
          { label: 'MEMORY', value: '63.8%', color: '#00ffff' },
          { label: 'QUANTUM', value: '99.2%', color: '#8844ff' },
        ]}
      />
      <HUDPanel
        position={[32, 4, -10]}
        side="right"
        title="CORE STATUS"
        items={[
          { label: 'ENERGY', value: '94.7%', color: '#00ffff' },
          { label: 'TEMPERATURE', value: '36.2°C', color: '#8844ff' },
          { label: 'UPTIME', value: '127h', color: '#0066ff' },
          { label: 'CONNECTIONS', value: '2,847', color: '#00ffff' },
          { label: 'THROUGHPUT', value: '1.4TB/s', color: '#8844ff' },
        ]}
      />
      <CommandBar position={[0, -27, -10]} />
      <DataRadar position={[32, -12, -10]} />
      <CircularDashboard position={[-32, -12, -10]} />
      <FloatingDataWindows count={6} />

      {/* ============== CAMERA ============== */}
      <CameraController speed={0.08} amplitude={1.2} />

      {/* ============== POST PROCESSING (Layer 7) ============== */}
      <PostProcessing />

      {/* Ambient fog */}
      <fog attach="fog" args={['#020617', 50, 150]} />
    </Canvas>
  );
};
