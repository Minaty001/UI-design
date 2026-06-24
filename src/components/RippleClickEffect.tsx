import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const RippleClickEffect = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let nextId = 0;

  const handleClick = useCallback((e: MouseEvent) => {
    const id = nextId++;
    setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1200);
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClick);
  }

  return (
    <AnimatePresence>
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{
            position: 'fixed',
            left: ripple.x - 50,
            top: ripple.y - 50,
            width: 100,
            height: 100,
            borderRadius: '50%',
            border: '1px solid rgba(0, 255, 255, 0.6)',
            pointerEvents: 'none',
            zIndex: 9998,
            opacity: 0.8,
          }}
          animate={{
            width: 300,
            height: 300,
            left: ripple.x - 150,
            top: ripple.y - 150,
            opacity: 0,
            borderWidth: 0.5,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: 9998,
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)',
          }}
        />
      ))}
    </AnimatePresence>
  );
};
