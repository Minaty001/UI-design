import { useState, useEffect } from 'react';

export const HolographicCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicking(true);
    const handleMouseUp = () => setClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      pointerEvents: 'none',
      zIndex: 9999,
      left: pos.x,
      top: pos.y,
      transform: 'translate(-50%, -50%)',
    }}>
      {/* Outer ring */}
      <div style={{
        width: clicking ? 24 : 32,
        height: clicking ? 24 : 32,
        border: '1px solid rgba(0, 255, 255, 0.6)',
        borderRadius: '50%',
        transition: 'width 0.15s, height 0.15s',
        boxShadow: '0 0 6px rgba(0, 255, 255, 0.3), inset 0 0 6px rgba(0, 255, 255, 0.1)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
      
      {/* Inner dot */}
      <div style={{
        width: 4,
        height: 4,
        backgroundColor: '#00ffff',
        borderRadius: '50%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 8px #00ffff, 0 0 16px rgba(0, 255, 255, 0.4)',
      }} />
      
      {/* Crosshair lines */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: -8,
        right: -8,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
        transform: 'translateY(-50%)',
      }} />
      <div style={{
        position: 'absolute',
        left: '50%',
        top: -8,
        bottom: -8,
        width: 1,
        background: 'linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
        transform: 'translateX(-50%)',
      }} />
    </div>
  );
};
