import { useState, useCallback, useEffect } from 'react';
import { MasterScene } from './components/MasterScene';
import { HUDOverlay } from './components/HUDOverlay';
import { HolographicCursor } from './components/HolographicCursor';
import { BootSequence } from './components/BootSequence';
import { RippleClickEffect } from './components/RippleClickEffect';
import { FloatingTooltips } from './components/FloatingTooltips';
import { RadialMenu } from './components/RadialMenu';
import './index.css';

function App() {
  const [booted, setBooted] = useState(false);
  const [showRadial, setShowRadial] = useState(false);
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

  // Double-click on background opens radial menu
  const handleCanvasDoubleClick = useCallback(() => {
    setShowRadial(prev => !prev);
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
      'DEEP SCAN INITIATED',
      'CORE TEMPERATURE NOMINAL',
    ];

    const interval = setInterval(() => {
      const id = Date.now().toString();
      const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
      const type = sampleTypes[Math.floor(Math.random() * 3)];

      setNotifications(prev => [...prev, { id, text, type }]);
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, 5000);
    }, 7000);

    return () => clearInterval(interval);
  }, [booted]);

  // Subtle startup notifications
  useEffect(() => {
    if (!booted) return;

    const startupNotes = [
      'NEURAL CORE INITIALIZED',
      'HOLOGRAPHIC LAYERS ACTIVE',
      'QUANTUM PROCESSOR ONLINE',
    ];

    startupNotes.forEach((text, i) => {
      setTimeout(() => {
        const id = `startup-${i}`;
        setNotifications(prev => [...prev, { id, text, type: 'success' }]);
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== id));
        }, 4000);
      }, (i + 1) * 1500);
    });
  }, [booted]);

  return (
    <div
      style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#020617' }}
      onDoubleClick={handleCanvasDoubleClick}
    >
      {/* Boot sequence */}
      {!booted && <BootSequence onComplete={handleBootComplete} />}

      {/* 3D Scene */}
      {booted && <MasterScene onCoreClick={handleCoreClick} />}

      {/* HTML HUD Overlay */}
      {booted && <HUDOverlay notifications={notifications} />}

      {/* Radial Menu */}
      {booted && <RadialMenu isOpen={showRadial} onClose={() => setShowRadial(false)} />}

      {/* Floating Tooltips */}
      {booted && <FloatingTooltips />}

      {/* Ripple Click Effects */}
      <RippleClickEffect />

      {/* Custom Cursor */}
      <HolographicCursor />

      {/* Startup help hint */}
      {booted && (
        <div
          style={{
            position: 'fixed',
            bottom: 70,
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 10,
            color: 'rgba(0, 255, 255, 0.15)',
            letterSpacing: 2,
            pointerEvents: 'none',
            zIndex: 50,
            animation: 'pulse 3s infinite',
            textAlign: 'center',
          }}
        >
          DOUBLE-CLICK FOR MENU • CLICK CORE FOR INTERFACE
        </div>
      )}
    </div>
  );
}

export default App;