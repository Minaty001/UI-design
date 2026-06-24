import { motion } from 'framer-motion';

interface HUDOverlayProps {
  notifications?: { id: string; text: string; type?: 'info' | 'warning' | 'success' }[];
}

export const HUDOverlay = ({ notifications = [] }: HUDOverlayProps) => {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 100,
      fontFamily: 'Rajdhani, sans-serif',
    }}>
      {/* Top bar with time */}
      <div style={{
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 30,
      }}>
        <div style={{ fontSize: 12, color: 'rgba(0, 255, 255, 0.5)', letterSpacing: 3 }}>
          JARVIS AI OS v3.0
        </div>
      </div>

      {/* Corner decorations */}
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0 40 L 0 0 L 40 0" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="2" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 40 40 L 40 0 L 0 0" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="2" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 0 0 L 0 40 L 40 40" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="2" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path d="M 40 0 L 40 40 L 0 40" fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="2" />
        </svg>
      </div>

      {/* Hexagonal frame overlay */}
      <div style={{
        position: 'absolute',
        top: 15,
        left: 55,
        right: 55,
        bottom: 15,
        border: '1px solid rgba(0, 255, 255, 0.08)',
        borderRadius: 2,
        pointerEvents: 'none',
      }} />

      {/* Notifications */}
      <div style={{
        position: 'absolute',
        top: 60,
        right: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}>
        {notifications.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            style={{
              padding: '8px 16px',
              backgroundColor: 'rgba(2, 6, 23, 0.8)',
              border: '1px solid ' + (
                notif.type === 'warning' ? 'rgba(255, 170, 0, 0.5)' :
                notif.type === 'success' ? 'rgba(0, 255, 255, 0.5)' :
                'rgba(0, 102, 255, 0.5)'
              ),
              backdropFilter: 'blur(10px)',
              fontSize: 11,
              color: '#fff',
              letterSpacing: 1,
              minWidth: 200,
            }}
          >
            <span style={{
              color: notif.type === 'warning' ? '#ffaa00' :
                     notif.type === 'success' ? '#00ffff' : '#0066ff',
              marginRight: 8,
            }}>
              {notif.type === 'warning' ? '⚠' : notif.type === 'success' ? '✓' : '→'}
            </span>
            {notif.text}
          </motion.div>
        ))}
      </div>

      {/* System status indicators at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 20,
        fontSize: 10,
        color: 'rgba(0, 255, 255, 0.3)',
        letterSpacing: 1,
      }}>
        {['NEURAL', 'QUANTUM', 'HOLOGRAPHIC', 'MEMORY'].map((sys, i) => (
          <div key={sys} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#00ffff',
              boxShadow: '0 0 6px rgba(0,255,255,0.5)',
              animation: 'pulse 2s infinite',
            }} />
            {sys}
          </div>
        ))}
      </div>
    </div>
  );
};
