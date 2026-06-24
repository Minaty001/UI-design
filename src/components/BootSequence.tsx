import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootSequenceProps {
  onComplete: () => void;
}

const bootSteps = [
  { text: 'INITIALIZING SYSTEM...', duration: 800 },
  { text: 'LOADING NEURAL CORE...', duration: 1000 },
  { text: 'CONNECTING NEURAL SYSTEMS...', duration: 1200 },
  { text: 'CALIBRATING HOLOGRAPHIC INTERFACE...', duration: 900 },
  { text: 'ESTABLISHING QUANTUM LINK...', duration: 600 },
  { text: 'SYSTEM ONLINE', duration: 400 },
];

export const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (currentStep >= bootSteps.length) {
      setTimeout(() => {
        setShow(false);
        setTimeout(onComplete, 500);
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, bootSteps[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: '#020617',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Orbitron, monospace',
          }}
        >
          {/* Progress bar */}
          <div style={{
            width: 400,
            height: 2,
            backgroundColor: 'rgba(0, 255, 255, 0.1)',
            marginBottom: 40,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / bootSteps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                backgroundColor: '#00ffff',
                boxShadow: '0 0 10px #00ffff, 0 0 20px rgba(0, 255, 255, 0.5)',
              }}
            />
          </div>

          {/* Step text */}
          <AnimatePresence mode="wait">
            {currentStep < bootSteps.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  color: '#00ffff',
                  fontSize: 18,
                  letterSpacing: 4,
                  textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                }}
              >
                {bootSteps[currentStep].text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning line */}
          <motion.div
            animate={{ y: [0, 200] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)',
              opacity: 0.3,
            }}
          />

          {/* Loading dots */}
          <div style={{
            position: 'absolute',
            bottom: 60,
            display: 'flex',
            gap: 8,
          }}>
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#00ffff',
                  boxShadow: '0 0 6px #00ffff',
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
