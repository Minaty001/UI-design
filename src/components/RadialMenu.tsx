import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RadialMenuItem {
  label: string;
  icon: string;
  color: string;
}

const menuItems: RadialMenuItem[] = [
  { label: 'NEURAL', icon: '🧠', color: '#00ffff' },
  { label: 'QUANTUM', icon: '⚛', color: '#8844ff' },
  { label: 'HOLOGRAM', icon: '💠', color: '#0066ff' },
  { label: 'MEMORY', icon: '💾', color: '#00ffff' },
  { label: 'ANALYZE', icon: '📊', color: '#8844ff' },
  { label: 'SYSTEM', icon: '⚙', color: '#0066ff' },
];

interface RadialMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RadialMenu = ({ isOpen, onClose }: RadialMenuProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(2, 6, 23, 0.5)',
            backdropFilter: 'blur(5px)',
            cursor: 'none',
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: 400,
              height: 400,
            }}
          >
            {/* Outer ring */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(0, 255, 255, 0.15)',
            }} />

            {/* Menu items */}
            {menuItems.map((item, i) => {
              const angle = (i / menuItems.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 140;
              const y = Math.sin(angle) * 140;
              const isHovered = hoveredIndex === i;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    x,
                    y,
                    transition: { delay: i * 0.05, type: 'spring' },
                  }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isHovered
                      ? `rgba(2, 6, 23, 0.9)`
                      : `rgba(2, 6, 23, 0.6)`,
                    border: `1px solid ${isHovered ? item.color : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered
                      ? `0 0 20px ${item.color}33, 0 0 40px ${item.color}11`
                      : 'none',
                  }}
                >
                  <span style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 8,
                    fontFamily: 'Orbitron, monospace',
                    color: item.color,
                    letterSpacing: 1,
                  }}>
                    {item.label}
                  </span>
                </motion.div>
              );
            })}

            {/* Center */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(2, 6, 23, 0.9)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)',
            }}>
              <span style={{
                fontSize: 10,
                fontFamily: 'Orbitron, monospace',
                color: '#00ffff',
                letterSpacing: 2,
              }}>
                MENU
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
