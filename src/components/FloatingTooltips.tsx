import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipContent {
  title: string;
  value: string;
  subtitle?: string;
}

const tooltips: Record<string, TooltipContent> = {
  'core': { title: 'NEURAL CORE', value: 'QUANTUM STATE', subtitle: 'ACTIVE v3.2.1' },
  'network-1': { title: 'SYNAPTIC WEB', value: '847 CONNECTIONS', subtitle: '98.3% EFFICIENCY' },
  'network-2': { title: 'COGNITIVE MAP', value: 'TERABYTE 1.4', subtitle: 'INDEXING ACTIVE' },
  'node-1': { title: 'MEMORY NODE', value: 'ADDRESS 0x7F', subtitle: 'RETRIEVAL READY' },
  'node-2': { title: 'DATA STREAM', value: '1.2 TB/s', subtitle: 'LATENCY 0.3ms' },
};

export const FloatingTooltips = () => {
  const [visible, setVisible] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const keys = Object.keys(tooltips);
    let index = 0;

    const interval = setInterval(() => {
      setVisible(keys[index]);
      index = (index + 1) % keys.length;

      setPos({
        x: 200 + Math.random() * 600,
        y: 150 + Math.random() * 300,
      });

      setTimeout(() => setVisible(null), 2500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 150 }}>
      <AnimatePresence>
        {visible && tooltips[visible] && (
          <motion.div
            key={visible}
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: pos.x,
              top: pos.y,
              background: 'rgba(2, 6, 23, 0.85)',
              backdropFilter: 'blur(16px) saturate(1.4)',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              padding: '12px 18px',
              minWidth: 180,
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.05), 0 0 60px rgba(0, 102, 255, 0.03)',
            }}
          >
            {/* Corner accents */}
            <div style={{
              position: 'absolute', top: -1, left: -1,
              width: 20, height: 20,
              borderTop: '1px solid rgba(0, 255, 255, 0.4)',
              borderLeft: '1px solid rgba(0, 255, 255, 0.4)',
            }} />
            <div style={{
              position: 'absolute', top: -1, right: -1,
              width: 20, height: 20,
              borderTop: '1px solid rgba(0, 255, 255, 0.4)',
              borderRight: '1px solid rgba(0, 255, 255, 0.4)',
            }} />
            <div style={{
              position: 'absolute', bottom: -1, left: -1,
              width: 20, height: 20,
              borderBottom: '1px solid rgba(0, 255, 255, 0.4)',
              borderLeft: '1px solid rgba(0, 255, 255, 0.4)',
            }} />
            <div style={{
              position: 'absolute', bottom: -1, right: -1,
              width: 20, height: 20,
              borderBottom: '1px solid rgba(0, 255, 255, 0.4)',
              borderRight: '1px solid rgba(0, 255, 255, 0.4)',
            }} />

            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 9,
              color: '#00ffff',
              letterSpacing: 2,
              marginBottom: 6,
            }}>
              {tooltips[visible].title}
            </div>
            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 16,
              color: '#fff',
              fontWeight: 500,
              marginBottom: 2,
            }}>
              {tooltips[visible].value}
            </div>
            {tooltips[visible].subtitle && (
              <div style={{
                fontFamily: 'Exo 2, sans-serif',
                fontSize: 10,
                color: 'rgba(200, 200, 220, 0.5)',
                letterSpacing: 1,
              }}>
                {tooltips[visible].subtitle}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
