import { useState, useCallback, useEffect } from 'react';
import { MasterScene } from './components/MasterScene';
import { HUDOverlay } from './components/HUDOverlay';
import { HolographicCursor } from './components/HolographicCursor';
import { BootSequence } from './components/BootSequence';
import './index.css';

function App() {
  const [booted, setBooted] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; text: string; type?: 'info' | 'warning' | 'success' }[]>([]);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  const handleCoreClick = useCallback(() => {
    const id = Date.now().toString();
    setNotifications(prev => [
      ...prev,
      { id, text: 'CORE INTERFACE ACCESSED', type: 'info' }
    ]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  // Periodic notifications
  useEffect(() => {
    if (!booted) return;

    const sampleTypes = ['info', 'success', 'warning'] as const;
    const sampleTexts = [
      'QUANTUM LINK STABLE',
      'NEURAL SYNC COMPLETE',
      'MEMORY INDEXING ACTIVE',
      'HOLOGRAPHIC CALIBRATION OK',
      'ENERGY FLOW NOMINAL',
    ];

    const interval = setInterval(() => {
      const id = Date.now().toString();
      const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const type = sampleTypes[Math.floor(Math.random() * 3)];

      setNotifications(prev => [...prev, { id, text, type }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 4000);
    }, 8000);

    return () => clearInterval(interval);
  }, [booted]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#020617' }}>
      {/* Boot sequence */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {/* 3D Scene */}
      {booted && <MasterScene onCoreClick={handleCoreClick} />}

      {/* HTML HUD Overlay */}
      {booted && <HUDOverlay notifications={notifications} />}

      {/* Custom Cursor */}
      <HolographicCursor />
    </div>
  );
}

export default App;